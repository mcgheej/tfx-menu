import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppMenuConfig, AppMenuProps } from '../types';
import { topupAppMenuConfig } from '../utils/topup-app-menu-config';

@Component({
  selector: 'tfx-app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMenuComponent {
  @Input({
    required: true,
    transform: (menu: AppMenuConfig) => topupAppMenuConfig(menu),
  })
  menu!: AppMenuProps;

  getAppMenuStyles() {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${this.menu.topLevelItems.length}, min-content)`,
    };
  }
}
