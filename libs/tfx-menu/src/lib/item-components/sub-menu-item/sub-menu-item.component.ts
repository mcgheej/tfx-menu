import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { MENU_ITEM_DATA } from '../../types/tokens';
import { SubMenuItemProps } from '../../types/types';

@Component({
  selector: 'tfx-sub-menu-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-menu-item.component.html',
  styleUrl: './sub-menu-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubMenuItemComponent {
  menuItemData = inject(MENU_ITEM_DATA);

  elementRef = inject(ElementRef);

  menuItem = this.menuItemData.menuItem as SubMenuItemProps;
  parentMenu = this.menuItemData.parentSubMenu;
  parentStateMachine = this.parentMenu.stateMachine;

  vm$ = combineLatest([
    this.parentStateMachine.highlightedItemId$,
    this.menuItem.disabled,
    this.menuItem.visible,
  ]).pipe(
    map(([highlightedItemId, disabled, visible]) => {
      const menuOptions = this.parentMenu.menuProps.options;
      return {
        color: disabled
          ? menuOptions.disabledItemTextColor
          : menuOptions.itemTextColor,
        backgroundColor:
          highlightedItemId === this.menuItem.id && !disabled
            ? menuOptions.itemHighlightColor
            : menuOptions.itemBackgroundColor,
        cursor: disabled ? 'default' : 'pointer',
        visible,
      };
    })
  );
}
