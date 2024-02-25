import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { TopLevelItemComponent } from '../item-components/top-level-item/top-level-item.component';
import { AppMenuConfig, AppMenuProps, TopLevelItemProps } from '../types';
import { topupAppMenuConfig } from '../utils/topup-app-menu-config';
import { AppMenuService } from './app-menu.service';

@Component({
  selector: 'tfx-app-menu',
  standalone: true,
  imports: [CommonModule, TopLevelItemComponent],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppMenuService],
})
export class AppMenuComponent implements OnChanges, OnDestroy {
  @Input({
    required: true,
    transform: (menu: AppMenuConfig) => topupAppMenuConfig(menu),
  })
  menu!: AppMenuProps;

  activeItemId$ = this.service.activeItemId$;

  constructor(private service: AppMenuService) {}

  ngOnChanges(): void {
    this.service.stopStateMachine();
    this.service.startStateMachine(this.menu); // TODO: Should this be OnChanges?
  }

  ngOnDestroy(): void {
    this.service.stopStateMachine();
  }

  getAppMenuStyles() {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${this.menu.topLevelItems.length}, max-content)`,
      'font-size': `${this.menu.options.fontSizePixels}px`,
    };
  }

  onMouseEnter(item: TopLevelItemProps) {
    this.service.onMouseEnter(item);
  }

  onMouseLeave(item: TopLevelItemProps) {
    this.service.onMouseLeave(item);
  }
}
