import { Injectable, QueryList, inject } from '@angular/core';
import { BehaviorSubject, Subscription, distinctUntilChanged } from 'rxjs';
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

  private itemComponentsSubscription: Subscription | null = null;

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
    if (this.itemComponentsSubscription) {
      this.itemComponentsSubscription.unsubscribe();
      this.itemComponentsSubscription = null;
    }
    if (this.appMenuActor) {
      this.appMenuActor.stop();
      this.appMenuActor = undefined;
    }
  }

  setItemComponents(components: QueryList<TopLevelItemComponent>) {
    this.onItemCmpsChange(components);
    this.itemComponentsSubscription = components.changes.subscribe(
      (changedComponents) => {
        this.onItemCmpsChange(changedComponents); // TODO - what happens if only one item changed
      }
    );
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

  private onItemCmpsChange(components: QueryList<TopLevelItemComponent>) {
    if (this.appMenuActor) {
      const itemCmps: ItemComponentCollection = {};
      components.map((cmp) => (itemCmps[cmp.item.id] = cmp));
      this.appMenuActor.send({ type: 'menu.itemComponentsChange', itemCmps });
    }
  }
}
