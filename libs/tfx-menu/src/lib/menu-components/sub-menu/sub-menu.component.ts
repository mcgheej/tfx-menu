import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CheckboxItemComponent } from '../../item-components/checkbox-item/checkbox-item.component';
import { CommandItemComponent } from '../../item-components/command-item/command-item.component';
import { ItemContainerComponent } from '../../item-components/item-container/item-container.component';
import { SubMenuItemComponent } from '../../item-components/sub-menu-item/sub-menu-item.component';
import { MenuParent } from '../../types/menu-parent.type';
import { MenuItemData } from '../../types/token.types';
import { MENU_ITEM_DATA, SUB_MENU_DATA } from '../../types/tokens';
import { ExecutableItemProps, SubMenuChildItemProps } from '../../types/types';
import { SubMenuStateMachineService } from './sub-menu-state-machine.service';

@Component({
  selector: 'tfx-sub-menu',
  standalone: true,
  imports: [CommonModule, ItemContainerComponent],
  templateUrl: './sub-menu.component.html',
  styleUrl: './sub-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SubMenuStateMachineService],
})
export class SubMenuComponent
  implements OnInit, OnDestroy, AfterViewInit, MenuParent
{
  subMenuData = inject(SUB_MENU_DATA);
  menuProps = this.subMenuData.subMenu;
  parentMenu = this.subMenuData.menuParent;

  @ViewChildren(ItemContainerComponent)
  viewChildren!: QueryList<ItemContainerComponent>;

  injector = inject(Injector);

  stateMachine = inject(SubMenuStateMachineService);

  private injectors: Map<string, Injector> = new Map<string, Injector>();

  private itemComponentsSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.stateMachine.startStateMachine(this.subMenuData.subMenu, this);
  }

  ngAfterViewInit(): void {
    this.stateMachine.setItemComponents(this.viewChildren);
    this.itemComponentsSubscription = this.viewChildren.changes.subscribe(
      (changes: QueryList<ItemContainerComponent>) => {
        this.stateMachine.setItemComponents(changes);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.itemComponentsSubscription) {
      this.itemComponentsSubscription.unsubscribe();
    }
    this.stateMachine.stopStateMachine();
  }

  /**
   * MenuParent Interface Implementation
   * ===================================
   */

  /**
   * @param item: properties of the executable menu item clicked
   *              by the user
   *
   * When a user clicks an executable menu item on any of this
   * sub-menu's descendent sub-menus then each descendent in turn
   * will call it's parent's onExecuteCommand method. In a sub-menu
   * this method calls a method on the sub-menu component's state
   * machine service to generate an "item.execute" event on the
   * state machine. The method then call's the onExecuteCommand
   * method on it's parent.
   */
  onExecuteCommand(item: ExecutableItemProps) {
    // Send item.execute event to sub-menu state machine
    this.stateMachine.onExecuteCommand();

    // Notify parent menu a command has been executed.
    this.parentMenu.onExecuteCommand(item);
  }

  /**
   * At any time a sub-menu will have 0 or 1 child sub-menus open.
   * If a sub-menu is open then this method is called by the child
   * sub-menu component when the pointer enters the child sub-menu
   * component. This method responds by calling a method on the state
   * machine service to generate a "childSubMenu.enter" event on the
   * sub-menu's state machine.
   */
  onEnterChildSubMenu() {
    this.stateMachine.onEnterSubMenu();
  }

  /**
   * Event Handlers
   * ==============
   */

  /**
   * Called when the user moves the pointer into the sub-menu. The
   * handler notifies the menu parent this has occured by calling
   * the MenuParent interface method onEnterChildSubMenu.
   */
  onEnterSubMenu() {
    this.parentMenu.onEnterChildSubMenu();
  }

  onMouseEnter(item: SubMenuChildItemProps) {
    this.stateMachine.onMouseEnter(item);
  }

  onMouseLeave(item: SubMenuChildItemProps) {
    this.stateMachine.onMouseLeave(item);
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
            ownerMenuCmp: this,
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
}
