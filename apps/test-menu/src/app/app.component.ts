import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  AppMenuComponent,
  AppMenuConfig,
  CheckboxItemConfig,
  CommandItemConfig,
  SubMenuConfig,
  SubMenuItemConfig,
} from '@tfx-menu/tfx-menu';

@Component({
  standalone: true,
  imports: [JsonPipe, AppMenuComponent],
  selector: 'tfx-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'test-menu';

  appMenu: AppMenuConfig = {
    type: 'appMenu',
    topLevelItems: [
      {
        type: 'topLevelItem',
        label: 'File',
        subMenu: {
          type: 'subMenu',
          itemGroups: [
            [
              {
                type: 'subMenuItem',
                label: 'New',
                subMenu: {
                  type: 'subMenu',
                  itemGroups: [
                    [
                      {
                        type: 'commandItem',
                        label: 'File',
                      } as CommandItemConfig,
                      {
                        type: 'commandItem',
                        label: 'Template',
                      } as CommandItemConfig,
                      {
                        type: 'subMenuItem',
                        label: 'Sub-Menu',
                        subMenu: {
                          type: 'subMenu',
                          itemGroups: [
                            [
                              {
                                type: 'commandItem',
                                label: 'Command 1',
                              } as CommandItemConfig,
                              {
                                type: 'checkboxItem',
                                label: 'Checkbox 1',
                              } as CheckboxItemConfig,
                              {
                                type: 'checkboxItem',
                                label: 'Checkbox 2',
                              } as CheckboxItemConfig,
                            ],
                          ],
                        } as SubMenuConfig,
                      } as SubMenuItemConfig,
                    ],
                  ],
                },
              } as SubMenuItemConfig,
              {
                type: 'commandItem',
                label: 'Open',
              } as CommandItemConfig,
              {
                type: 'checkboxItem',
                label: 'Saved',
              } as CheckboxItemConfig,
            ],
            [
              {
                type: 'commandItem',
                label: 'Exit',
              } as CommandItemConfig,
            ],
          ],
        },
      },
      {
        type: 'topLevelItem',
        label: 'Edit',
      },
      {
        type: 'topLevelItem',
        label: 'Help',
      },
    ],
  };
}
