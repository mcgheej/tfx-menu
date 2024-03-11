import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { MENU_ITEM_DATA } from '../../tokens';
import { CheckboxItemProps } from '../../types';

@Component({
  selector: 'tfx-checkbox-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox-item.component.html',
  styleUrl: './checkbox-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxItemComponent {
  menuItemData = inject(MENU_ITEM_DATA);
  elementRef = inject(ElementRef);

  menuItem = this.menuItemData.menuItem as CheckboxItemProps;
  parentMenu = this.menuItemData.parentSubMenu;
  parentStateMachine = this.parentMenu.stateMachine;

  vm$ = combineLatest([
    this.parentStateMachine.highlightedItemId$,
    this.menuItem.disabled,
    this.menuItem.visible,
    this.menuItem.checked,
  ]).pipe(
    map(([highlightedItemId, disabled, visible, checked]) => {
      const menuOptions = this.parentMenu.menuProps.options;
      return {
        disabled,
        color: disabled
          ? menuOptions.disabledItemTextColor
          : menuOptions.itemTextColor,
        backgroundColor:
          highlightedItemId === this.menuItem.id && !disabled
            ? menuOptions.itemHighlightColor
            : menuOptions.itemBackgroundColor,
        cursor: disabled ? 'default' : 'pointer',
        visible,
        checked,
      };
    })
  );

  itemClick(disabled: boolean) {
    if (!disabled) {
      this.parentMenu.onExecuteCommand(this.menuItem);
    }
  }
}