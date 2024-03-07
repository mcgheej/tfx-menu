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
import { TopLevelItemComponent } from '../item-components/top-level-item/top-level-item.component';
import {
  AppMenuConfig,
  AppMenuProps,
  ExecutableItemProps,
  TopLevelItemProps,
} from '../types';
import { topupAppMenuConfig } from '../utils/topup-app-menu-config';
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
export class AppMenuComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input({
    required: true,
    transform: (menu: AppMenuConfig) => topupAppMenuConfig(menu),
  })
  menu!: AppMenuProps;

  @ViewChildren(TopLevelItemComponent)
  viewChildren!: QueryList<TopLevelItemComponent>;

  stateMachine = inject(AppMenuStateMachineService);

  private itemComponentsSubscription: Subscription | null = null;
  private backdropClickSubscription: Subscription | null = null;

  activeItemId$ = this.stateMachine.activeItemId$;

  ngOnChanges(): void {
    this.stateMachine.stopStateMachine();
    this.stateMachine.startStateMachine(this.menu, this);
  }

  ngAfterViewInit(): void {
    this.stateMachine.setItemComponents(this.viewChildren);
    this.itemComponentsSubscription = this.viewChildren.changes.subscribe(
      (children) => {
        this.stateMachine.setItemComponents(children);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.itemComponentsSubscription) {
      this.itemComponentsSubscription.unsubscribe();
    }
    if (this.backdropClickSubscription) {
      this.backdropClickSubscription.unsubscribe();
    }
    this.stateMachine.stopStateMachine();
  }

  getAppMenuStyles() {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${this.menu.topLevelItems.length}, max-content)`,
      'font-size': `${this.menu.options.fontSizePixels}px`,
    };
  }

  onMouseEnter(item: TopLevelItemProps) {
    this.stateMachine.onMouseEnter(item);
  }

  onMouseLeave(item: TopLevelItemProps) {
    this.stateMachine.onMouseLeave(item);
  }

  onMouseClick(item: TopLevelItemProps) {
    this.stateMachine.onMouseClick(item);
  }

  onExecuteCommand(item: ExecutableItemProps) {
    // Notify state machine a command is to be executed
    this.stateMachine.onExecuteCommand();

    // Execute the command
    item.exec();
  }
}
