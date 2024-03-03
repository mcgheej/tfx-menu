import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Actor, createActor } from 'xstate';
import { SubMenuChildItemProps, SubMenuProps } from '../../types';
import {
  noItemActive,
  noItemHighlighted,
  subMenuMachine,
} from './sub-menu.xstate';

@Injectable()
export class SubMenuStateMachineService {
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

  startStateMachine(subMenu: SubMenuProps) {
    this.stopStateMachine();
    this.subMenuActor = createActor(subMenuMachine, {
      input: {
        subMenu: subMenu,
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
    if (this.subMenuActor) {
      this.subMenuActor.stop();
      this.subMenuActor = undefined;
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
}
