import { Injectable, QueryList, inject } from '@angular/core';
import { BehaviorSubject, Subscription, distinctUntilChanged } from 'rxjs';
import { Actor, createActor } from 'xstate';
import { ItemComponentCollection } from '../../item-component-collection';
import { ItemContainerComponent } from '../../item-components/item-container/item-container.component';
import { PopupService } from '../../popup-service/popup-service';
import { SubMenuChildItemProps, SubMenuProps } from '../../types';
import {
  noItemActive,
  noItemHighlighted,
  subMenuMachine,
} from './+xstate/sub-menu.xstate';
import { SubMenuComponent } from './sub-menu.component';

@Injectable()
export class SubMenuStateMachineService {
  private popupService = inject(PopupService);
  private activeItemIdSubject$ = new BehaviorSubject<string>(noItemActive);
  activeItemId$ = this.activeItemIdSubject$
    .asObservable()
    .pipe(distinctUntilChanged());

  private highlightedItemIdSubject$ = new BehaviorSubject<string>(
    noItemHighlighted
  );
  highlightedItemId$ = this.highlightedItemIdSubject$
    .asObservable()
    .pipe(distinctUntilChanged());

  private subMenuActor: Actor<typeof subMenuMachine> | undefined;

  private itemComponentsSubscription: Subscription | null = null;

  startStateMachine(subMenu: SubMenuProps, subMenuCmp: SubMenuComponent) {
    this.stopStateMachine();
    this.subMenuActor = createActor(subMenuMachine, {
      input: {
        subMenu: subMenu,
        subMenuCmp,
        popupService: this.popupService,
      },
    });
    this.subMenuActor.start();
    this.subMenuActor.subscribe((snapshot) => {
      let item = snapshot.context.activeItem;
      this.activeItemIdSubject$.next(item ? item.id : noItemActive);
      item = snapshot.context.highlightedItem;
      this.highlightedItemIdSubject$.next(item ? item.id : noItemHighlighted);
    });
  }

  stopStateMachine() {
    if (this.itemComponentsSubscription) {
      this.itemComponentsSubscription.unsubscribe();
      this.itemComponentsSubscription = null;
    }
    if (this.subMenuActor) {
      this.subMenuActor.stop();
      this.subMenuActor = undefined;
    }
  }

  setItemComponents(components: QueryList<ItemContainerComponent>) {
    this.onItemCmpsChange(components);
    this.itemComponentsSubscription = components.changes.subscribe(
      (changedComponents) => {
        this.onItemCmpsChange(changedComponents); // TODO - what happens if only one item changed
      }
    );
  }

  onEnterSubMenu() {
    if (this.subMenuActor) {
      this.subMenuActor.send({ type: 'childSubMenu.enter' });
    }
  }

  onMouseEnter(item: SubMenuChildItemProps) {
    if (this.subMenuActor) {
      this.subMenuActor.send({ type: 'item.enter', item });
    }
  }

  onMouseLeave(item: SubMenuChildItemProps) {
    if (this.subMenuActor) {
      this.subMenuActor.send({ type: 'item.leave', item });
    }
  }

  onExecuteCommand() {
    if (this.subMenuActor) {
      this.subMenuActor.send({ type: 'item.execute' });
    }
  }

  private onItemCmpsChange(components: QueryList<ItemContainerComponent>) {
    if (this.subMenuActor) {
      const itemCmps: ItemComponentCollection = {};
      components.map((cmp) => (itemCmps[cmp.item.id] = cmp));
      this.subMenuActor.send({
        type: 'subMenu.itemComponentsChange',
        itemCmps,
      });
    }
  }
}
