import { Injectable, SimpleChanges } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
} from 'rxjs';
import { noItemActive } from '../../app-menu/app-menu.xstate';
import { CommandItemProps, MenuOptionsProps } from '../../types';
import { SUB_MENU_DEFAULT_OPTIONS } from '../../utils/menu-defaults';

export interface CommandItemVm {
  color: string;
  backgroundColor: string;
  cursor: string;
  visible: boolean;
  label: string;
  subLabel: string;
}

@Injectable()
export class CommandItemVmService {
  // Observables used to drive component CommandItemVm observable
  private activeId$ = new BehaviorSubject<string>(noItemActive);
  private disabled$ = new BehaviorSubject<boolean>(false);
  private visible$ = new BehaviorSubject<boolean>(false);
  private item$ = new BehaviorSubject<CommandItemProps | null>(null);
  private menuOptions$ = new BehaviorSubject<MenuOptionsProps>({
    ...SUB_MENU_DEFAULT_OPTIONS,
  });

  // CommandItemVm observable - emits whenever one of the 5 contributing
  // observables emits.
  vm$: Observable<CommandItemVm> = combineLatest([
    this.activeId$.pipe(distinctUntilChanged()),
    this.disabled$.pipe(distinctUntilChanged()),
    this.visible$.pipe(distinctUntilChanged()),
    this.item$.pipe(distinctUntilChanged()),
    this.menuOptions$.pipe(distinctUntilChanged()),
  ]).pipe(
    map(([activeId, disabled, visible, item, menuOptions]) => {
      if (item) {
        return {
          visible,
          disabled,
          color: disabled
            ? menuOptions.disabledItemTextColor
            : menuOptions.itemTextColor,
          backgroundColor:
            activeId === item.id && !disabled
              ? menuOptions.itemHighlightColor
              : menuOptions.itemBackgroundColor,
          cursor: disabled ? 'default' : 'pointer',
          label: item.label,
          subLabel: item.subLabel,
        };
      }

      return {
        visible: false,
        disabled: false,
        color: '#000000',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        label: '',
        subLabel: '',
      };
    })
  );

  // Whenever the item changes need to unsubscribe from the disabled and
  // visible observables of the previous item and then subscribe to the
  // properties of the new item. These Subscription variables are used
  // to manage that process
  private itemDisabledSubscription: Subscription | null = null;
  private itemVisibleSubscription: Subscription | null = null;

  // Called by the associated component's ngOnChanges() method
  onChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      switch (propName) {
        case 'item':
          this.changeItem(changes['item'].currentValue);
          break;
        case 'menuOptions':
          this.changeMenuOptions(changes['menuOptions'].currentValue);
          break;
        case 'activeItemId':
          this.changeActiveItemId(changes['activeItemId'].currentValue);
          break;
      }
    }
  }

  // Called by the associated component's ngOnDestory() method
  clearDown() {
    if (this.itemDisabledSubscription) {
      this.itemDisabledSubscription.unsubscribe();
    }
    if (this.itemVisibleSubscription) {
      this.itemVisibleSubscription.unsubscribe();
    }
  }

  // Simply emit the new activeItemId to update the component's VM
  // properties if necessary
  private changeActiveItemId(id: string) {
    this.activeId$.next(id);
  }

  // Simply emit the new menuOptions to update the component's VM
  // properties if necessary
  private changeMenuOptions(menuOptions: MenuOptionsProps) {
    this.menuOptions$.next(menuOptions);
  }

  // Emit the item to update the compnent's VM properties and
  // resubscribe to the item's disabled and visible observables to
  // drive the input observables to the component's VM observable
  private changeItem(item: CommandItemProps) {
    this.item$.next(item);

    if (this.itemDisabledSubscription) {
      this.itemDisabledSubscription.unsubscribe();
    }
    this.itemDisabledSubscription = item.disabled.subscribe((disabled) => {
      this.disabled$.next(disabled);
    });

    if (this.itemVisibleSubscription) {
      this.itemVisibleSubscription.unsubscribe();
    }
    this.itemVisibleSubscription = item.visible.subscribe((visible) => {
      this.visible$.next(visible);
    });
  }
}
