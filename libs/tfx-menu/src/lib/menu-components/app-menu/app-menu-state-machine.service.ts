import { Injectable, QueryList, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Actor, createActor } from 'xstate';
import { ItemComponentCollection } from '../../item-component-collection';
import { TopLevelItemComponent } from '../../item-components/top-level-item/top-level-item.component';
import { PopupService } from '../../popup-service/popup-service';
import { AppMenuProps, TopLevelItemProps } from '../../types/types';
import { appMenuMachine, noItemActive } from './+xstate/app-menu.xstate';
import { AppMenuComponent } from './app-menu.component';

@Injectable()
export class AppMenuStateMachineService {
  private popupService = inject(PopupService);

  private activeItemIdSubject$ = new BehaviorSubject<string>(noItemActive);
  activeItemId$ = this.activeItemIdSubject$
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   * The expandedItem$ observable can be used to monitor when a sub-menu
   * is expanded or not. If a top level item sub-menu is visible then the
   * last value emitted will be true. If no top level sub-menus are
   * visible then the last value emitted will be false.
   */
  private expandedItemSubject$ = new BehaviorSubject<boolean>(false);
  expandedItem$ = this.expandedItemSubject$
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
      if (snapshot.matches({ active: 'expanded' })) {
        this.expandedItemSubject$.next(true);
      } else {
        this.expandedItemSubject$.next(false);
      }
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
