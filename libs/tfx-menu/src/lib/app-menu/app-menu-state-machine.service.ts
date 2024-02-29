import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Actor, createActor } from 'xstate';
import { AppMenuProps, TopLevelItemProps } from '../types';
import { AppMenuSubMenuService } from './app-menu-sub-menu.service';
import { appMenuMachine, noItemActive } from './app-menu.xstate';

@Injectable()
export class AppMenuStateMachineService {
  private activeItemIdSubject$ = new BehaviorSubject<string>(noItemActive);
  activeItemId$ = this.activeItemIdSubject$
    .asObservable()
    .pipe(distinctUntilChanged());

  private appMenuActor: Actor<typeof appMenuMachine> | undefined;

  startStateMachine(
    appMenu: AppMenuProps,
    subMenuController: AppMenuSubMenuService
  ) {
    if (this.appMenuActor) {
      this.stopStateMachine();
    }
    this.appMenuActor = createActor(appMenuMachine, {
      input: {
        appMenu: appMenu,
      },
    });
    this.appMenuActor.start();
    this.appMenuActor.subscribe((snapshot) => {
      const item = snapshot.context.activeItem;
      this.activeItemIdSubject$.next(item ? item.id : noItemActive);
      subMenuController.checkExpandedItem(snapshot.context.expandedItem);
    });
  }

  stopStateMachine() {
    if (this.appMenuActor) {
      this.appMenuActor.stop();
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

  onBackdropClick() {
    if (this.appMenuActor) {
      this.appMenuActor.send({ type: 'backdrop.click' });
    }
  }
}
