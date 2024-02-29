import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  inject,
} from '@angular/core';
import { CommandItemComponent } from '../../item-components/command-item/command-item.component';
import { MENU_ITEM_DATA, SUB_MENU_DATA } from '../../tokens';
import { SubMenuChildItemProps } from '../../types';

@Component({
  selector: 'tfx-sub-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-menu.component.html',
  styleUrl: './sub-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubMenuComponent {
  subMenu = inject(SUB_MENU_DATA);
  injector = inject(Injector);

  private injectors: Map<string, Injector> = new Map<string, Injector>();

  getInjector(item: SubMenuChildItemProps): Injector {
    let injector = this.injectors.get(item.id);
    if (injector) {
      return injector;
    }

    injector = Injector.create({
      providers: [{ provide: MENU_ITEM_DATA, useValue: item }],
      parent: this.injector,
    });
    this.injectors.set(item.id, injector);
    return injector;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getComponentType(item: SubMenuChildItemProps): any {
    switch (item.type) {
      case 'commandItem':
        return CommandItemComponent;
      case 'checkboxItem':
        return CommandItemComponent;
    }
    return CommandItemComponent;
  }
}
