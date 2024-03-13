import { Injectable, inject } from '@angular/core';
import { Actor, createActor } from 'xstate';
import { PopupService } from '../../popup-service/popup-service';
import { ContextPopupConfig } from '../../types/context-popup-config.type';
import { ContextMenuConfig, ExecutableItemProps } from '../../types/types';
import { topupContextMenuConfig } from '../../utils/topup-app-menu-config';
import { contextMenuMachine } from './+xstate/context-menu.xstate';

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  private popupService = inject(PopupService);

  private contextMenuActor: Actor<typeof contextMenuMachine> | undefined;

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

  onExecuteCommand(item: ExecutableItemProps) {
    if (this.contextMenuActor) {
      this.contextMenuActor.send({ type: 'item.execute' });
    }
    item.exec();
  }

  onEnterChildSubMenu() {
    // do nothing
  }

  private stopStateMachine() {
    if (this.contextMenuActor) {
      this.contextMenuActor.stop();
      this.contextMenuActor = undefined;
    }
  }
}
