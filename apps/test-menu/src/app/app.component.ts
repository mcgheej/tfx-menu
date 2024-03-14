import { JsonPipe } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  AppMenuComponent,
  CommandItemConfig,
  ContextMenuService,
  SubMenuConfig,
  SubMenuGroupConfig,
  SubMenuItemConfig,
} from '@tfx-menu/tfx-menu';
import { longMenu } from './long-menu';
import { shortMenu } from './short-menu';

@Component({
  standalone: true,
  imports: [JsonPipe, AppMenuComponent],
  selector: 'tfx-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('button') buttonEl!: ElementRef<HTMLElement>;
  contextMenuService = inject(ContextMenuService);

  title = 'test-menu';
  showShortMenu = true;
  shortMenu = shortMenu;
  longMenu = longMenu;

  appMenu = this.shortMenu;

  onClick() {
    if (this.buttonEl) {
      this.contextMenuService.open(
        {
          type: 'contextMenu',
          itemGroups: [
            [
              {
                type: 'commandItem',
                label: 'Command 1',
                exec: () => console.log('Command 1 clicked'),
              } as CommandItemConfig,
              {
                type: 'commandItem',
                label: 'Command 2',
                exec: () => console.log('Command 2 clicked'),
              } as CommandItemConfig,
              {
                type: 'subMenuItem',
                label: 'More Commands',
                subMenu: {
                  type: 'subMenu',
                  itemGroups: [
                    [
                      {
                        type: 'commandItem',
                        label: 'Command 3',
                        exec: () => console.log('Command 3 clicked'),
                      } as CommandItemConfig,
                      {
                        type: 'commandItem',
                        label: 'Command 4',
                        exec: () => console.log('Command 4 clicked'),
                      } as CommandItemConfig,
                      {
                        type: 'commandItem',
                        label: 'Toggle Menu',
                        exec: this.toggleMenu(),
                      } as CommandItemConfig,
                    ],
                  ] as SubMenuGroupConfig[],
                } as SubMenuConfig,
              } as SubMenuItemConfig,
            ],
          ] as SubMenuGroupConfig[],
        },
        {
          associatedElement: this.buttonEl,
          positions: [
            {
              originX: 'end',
              originY: 'top',
              overlayX: 'start',
              overlayY: 'top',
            },
          ],
        }
      );
    }
  }

  private toggleMenu(): () => void {
    return () => {
      this.showShortMenu = !this.showShortMenu;
      this.appMenu = this.showShortMenu ? this.shortMenu : this.longMenu;
    };
  }
}
