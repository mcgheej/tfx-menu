import { Injectable, inject } from '@angular/core';
import { Actor, createActor } from 'xstate';
import { PopupService } from '../../popup-service/popup-service';
import { ContextPopupConfig } from '../../types/context-popup-config.type';
import { MenuParent } from '../../types/menu-parent.type';
import { ContextMenuConfig, ExecutableItemProps } from '../../types/types';
import { topupContextMenuConfig } from '../../utils/topup-app-menu-config';
import { contextMenuMachine } from './+xstate/context-menu.xstate';

@Injectable({ providedIn: 'root' })
export class ContextMenuService implements MenuParent {
  private popupService = inject(PopupService);

  private contextMenuActor: Actor<typeof contextMenuMachine> | undefined;

  /**
   * MenuParent Interface Implementation
   * ===================================
   */

  /**
   * @param item: properties of the executable menu item clicked
   *              by the user
   *
   * When a user clicks an executable menu item on anywhere in the
   * context menu hierarchy it will bubble up through the menu
   * component hierarchy to this method which sends an "item.execute"
   * event to the context menu state machine then executes the item
   * by calling the exec property function.
   */
  onExecuteCommand(item: ExecutableItemProps) {
    if (this.contextMenuActor) {
      this.contextMenuActor.send({ type: 'item.execute' });
    }
    item.exec();
  }

  /**
   * The ContextMenuService does nothing when the user moves the
   * pointer into the context menu itself
   */
  onEnterChildSubMenu() {
    // do nothing
  }

  open(menuConfig: ContextMenuConfig, popupConfig: ContextPopupConfig) {
    const menuProps = topupContextMenuConfig(menuConfig);

    this.stopStateMachine();
    this.contextMenuActor = createActor(contextMenuMachine, {
      input: {
        contextMenu: menuProps,
        contextMenuService: this,
        popupService: this.popupService,
        popupConfig,
      },
    });
    this.contextMenuActor.start();
    this.contextMenuActor.subscribe((snapshot) => {
      if (snapshot.status === 'done') {
        this.stopStateMachine();
      }
    });
  }

  private stopStateMachine() {
    if (this.contextMenuActor) {
      this.contextMenuActor.stop();
      this.contextMenuActor = undefined;
    }
  }
}
