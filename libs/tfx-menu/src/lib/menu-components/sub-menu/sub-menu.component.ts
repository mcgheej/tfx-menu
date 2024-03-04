import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CheckboxItemComponent } from '../../item-components/checkbox-item/checkbox-item.component';
import { CommandItemComponent } from '../../item-components/command-item/command-item.component';
import { SubMenuItemComponent } from '../../item-components/sub-menu-item/sub-menu-item.component';
import { MenuItemData } from '../../token.types';
import { MENU_ITEM_DATA, SUB_MENU_DATA } from '../../tokens';
import { ExecutableItemProps, SubMenuChildItemProps } from '../../types';
import { SubMenuStateMachineService } from './sub-menu-state-machine.service';

@Component({
  selector: 'tfx-sub-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-menu.component.html',
  styleUrl: './sub-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SubMenuStateMachineService],
})
export class SubMenuComponent implements OnInit, OnDestroy {
  subMenuData = inject(SUB_MENU_DATA);
  menuProps = this.subMenuData.subMenu;
  parentMenu = this.subMenuData.parentMenu;

  injector = inject(Injector);

  stateMachine = inject(SubMenuStateMachineService);

  private injectors: Map<string, Injector> = new Map<string, Injector>();

  ngOnInit(): void {
    this.stateMachine.startStateMachine(this.subMenuData.subMenu);
  }

  ngOnDestroy(): void {
    this.stateMachine.stopStateMachine();
  }

  getInjector(item: SubMenuChildItemProps): Injector {
    let injector = this.injectors.get(item.id);
    if (injector) {
      return injector;
    }

    injector = Injector.create({
      providers: [
        {
          provide: MENU_ITEM_DATA,
          useValue: {
            menuItem: item,
            parentSubMenu: this,
          } as MenuItemData,
        },
      ],
      parent: this.injector,
    });
    this.injectors.set(item.id, injector);
    return injector;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getComponentType(item: SubMenuChildItemProps): any {
    switch (item.type) {
      case 'commandItem':
        return CommandItemComponent;
      case 'checkboxItem':
        return CheckboxItemComponent;
    }
    return SubMenuItemComponent;
  }

  onMouseEnter(item: SubMenuChildItemProps) {
    this.stateMachine.onMouseEnter(item);
  }

  onMouseLeave(item: SubMenuChildItemProps) {
    this.stateMachine.onMouseLeave(item);
  }

  onExecuteCommand(item: ExecutableItemProps) {
    // Send item.execute event to sub-menu state machine
    this.stateMachine.onExecuteCommand();

    // Notify parent menu a command has been executed.
    this.parentMenu.onExecuteCommand(item);
  }
}
