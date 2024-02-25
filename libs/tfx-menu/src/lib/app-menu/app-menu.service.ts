import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Actor, createActor } from 'xstate';
import { AppMenuProps, TopLevelItemProps } from '../types';
import { appMenuMachine, noItemActive } from './app-menu.xstate';

@Injectable()
export class AppMenuService {
  private activeItemIdSubject$ = new BehaviorSubject<string>(noItemActive);
  activeItemId$ = this.activeItemIdSubject$
    .asObservable()
    .pipe(distinctUntilChanged());
  private appMenuActor: Actor<typeof appMenuMachine> | undefined;

  startStateMachine(appMenu: AppMenuProps) {
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
}
