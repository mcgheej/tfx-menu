import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { MENU_ITEM_DATA } from '../../tokens';
import { CommandItemProps } from '../../types';

@Component({
  selector: 'tfx-command-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './command-item.component.html',
  styleUrl: './command-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandItemComponent {
  menuItemData = inject(MENU_ITEM_DATA);
  menuItem = this.menuItemData.menuItem as CommandItemProps;
  parentMenu = this.menuItemData.parentSubMenu;
  parentStateMachine = this.parentMenu.stateMachine;

  vm$ = combineLatest([
    this.parentStateMachine.activeItemId$,
    this.menuItem.disabled,
    this.menuItem.visible,
  ]).pipe(
    map(([activeId, disabled, visible]) => {
      const menuOptions = this.parentMenu.menuProps.options;
      return {
        disabled,
        color: disabled
          ? menuOptions.disabledItemTextColor
          : menuOptions.itemTextColor,
        backgroundColor:
          activeId === this.menuItem.id && !disabled
            ? menuOptions.itemHighlightColor
            : menuOptions.itemBackgroundColor,
        cursor: disabled ? 'default' : 'pointer',
        visible,
      };
    })
  );

  itemClick(disabled: boolean) {
    if (!disabled) {
      // this.menuItem.exec();
      this.parentMenu.onExecuteCommand(this.menuItem);
    }
  }
}
