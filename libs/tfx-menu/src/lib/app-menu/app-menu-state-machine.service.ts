import { Injectable, QueryList, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Actor, createActor } from 'xstate';
import { ItemComponentCollection } from '../item-component-collection';
import { TopLevelItemComponent } from '../item-components/top-level-item/top-level-item.component';
import { PopupService } from '../popup-service/popup-service';
import { AppMenuProps, TopLevelItemProps } from '../types';
import { appMenuMachine, noItemActive } from './+xstate/app-menu.xstate';
import { AppMenuComponent } from './app-menu.component';

@Injectable()
export class AppMenuStateMachineService {
  private popupService = inject(PopupService);

  private activeItemIdSubject$ = new BehaviorSubject<string>(noItemActive);
  activeItemId$ = this.activeItemIdSubject$
    .asObservable()
    .pipe(distinctUntilChanged());

  private appMenuActor: Actor<typeof appMenuMachine> | undefined;

  startStateMachine(appMenu: AppMenuProps, parentMenu: AppMenuComponent) {
    this.stopStateMachine();
    this.appMenuActor = createActor(appMenuMachine, {
      input: {
        appMenu: appMenu,
        appMenuCmp: parentMenu,
        popupService: this.popupService,
      },
    });
    this.appMenuActor.start();
    this.appMenuActor.subscribe((snapshot) => {
      const item = snapshot.context.activeItem;
      this.activeItemIdSubject$.next(item ? item.id : noItemActive);
    });
  }

  stopStateMachine() {
    if (this.appMenuActor) {
      this.appMenuActor.stop();
      this.appMenuActor = undefined;
    }
  }

  setItemComponents(components: QueryList<TopLevelItemComponent>) {
    if (this.appMenuActor) {
      const itemCmps: ItemComponentCollection = {};
      components.map((cmp) => (itemCmps[cmp.item.id] = cmp));
      this.appMenuActor.send({ type: 'menu.itemComponentsChange', itemCmps });
    }
  }

  onMouseEnter(item: TopLevelItemProps) {
    if (this.appMenuActor) {
      this.appMenuActor.send({ type: 'topLevelItem.enter', item });
    }
  }

  onMouseLeave(item: TopLevelItemProps) {
    if (this.appMenuActor) {
      this.appMenuActor.send({ type: 'topLevelItem.leave', item });
    }
  }

  onMouseClick(item: TopLevelItemProps) {
    if (this.appMenuActor) {
      this.appMenuActor.send({ type: 'topLevelItem.click', item });
    }
  }

  onExecuteCommand() {
    if (this.appMenuActor) {
      this.appMenuActor.send({ type: 'item.execute' });
    }
  }
}
