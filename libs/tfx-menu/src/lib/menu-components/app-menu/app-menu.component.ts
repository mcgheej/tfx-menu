import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TopLevelItemComponent } from '../../item-components/top-level-item/top-level-item.component';
import { MenuParent } from '../../types/menu-parent.type';
import {
  AppMenuConfig,
  AppMenuProps,
  ExecutableItemProps,
  TopLevelItemProps,
} from '../../types/types';
import { topupAppMenuConfig } from '../../utils/topup-app-menu-config';
import { AppMenuStateMachineService } from './app-menu-state-machine.service';

@Component({
  selector: 'tfx-app-menu',
  standalone: true,
  imports: [CommonModule, TopLevelItemComponent],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppMenuStateMachineService],
})
export class AppMenuComponent
  implements OnChanges, OnDestroy, AfterViewInit, MenuParent
{
  @Input({
    required: true,
    transform: (menu: AppMenuConfig) => topupAppMenuConfig(menu),
  })
  menu!: AppMenuProps;

  @ViewChildren(TopLevelItemComponent)
  viewChildren!: QueryList<TopLevelItemComponent>;

  stateMachine = inject(AppMenuStateMachineService);

  /**
   * Track the current id for the active item. This is used
   * as an input to the top level menu item components.
   */
  activeItemId$ = this.stateMachine.activeItemId$;

  /**
   * Track whether or not a top level item sub-menu is visible. This
   * is used in the template to set the app-menu z-index to give the
   * desired behaviour, specifically if a sub-menu is visible then the
   * z-index need to be raised to be over the sub-menu backdrop to
   * keep the top level items accessible to the user, otherwise the
   * z-index is lowered so that other popup UI elements can sit above
   * the app menu in the display order.
   */
  expandedItem$ = this.stateMachine.expandedItem$;

  private itemComponentsSubscription: Subscription | null = null;

  ngOnChanges(): void {
    this.stateMachine.stopStateMachine();
    this.stateMachine.startStateMachine(this.menu, this);
  }

  ngAfterViewInit(): void {
    this.stateMachine.setItemComponents(this.viewChildren);
    this.itemComponentsSubscription = this.viewChildren.changes.subscribe(
      (changes: QueryList<TopLevelItemComponent>) => {
        this.stateMachine.setItemComponents(changes);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.itemComponentsSubscription) {
      this.itemComponentsSubscription.unsubscribe();
    }
    this.stateMachine.stopStateMachine();
  }

  /**
   * MenuParent Interface Implementation
   * ===================================
   *
   */

  /**
   * @param item: properties of the executable menu item clicked
   *              by the user
   *
   * When a user clicks an executable menu item on any of the app
   * menu's descendent sub-menus then it will bubble up through
   * the menu hierarchy to this method which calls the app menu's
   * state machine service to generate an "item.execute" event on
   * the state machine.
   * The method then executes the command by calling the exec property
   * function.
   */
  onExecuteCommand(item: ExecutableItemProps) {
    this.stateMachine.onExecuteCommand();
    item.exec();
  }

  /** -------------------------------------------------------------- */

  /**
   *
   * @returns object containing app menu styles
   */
  getAppMenuStyles() {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${this.menu.topLevelItems.length}, max-content)`,
      'font-size': `${this.menu.options.fontSizePixels}px`,
    };
  }

  /**
   * This method is called by a child sub-menu component when the
   * pointer device enters the sub-menu. This method does nothing
   * as the app menu doesn't care about the pointer entering the
   * sub-menu
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onEnterChildSubMenu() {}

  /**
   * Event Handlers
   * ==============
   */
  onMouseEnter(item: TopLevelItemProps) {
    this.stateMachine.onMouseEnter(item);
  }

  onMouseLeave(item: TopLevelItemProps) {
    this.stateMachine.onMouseLeave(item);
  }

  onMouseClick(item: TopLevelItemProps) {
    this.stateMachine.onMouseClick(item);
  }
}
