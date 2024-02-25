import {
  AppMenuConfig,
  CheckboxItemConfig,
  CommandItemConfig,
  SubMenuConfig,
  SubMenuItemConfig,
} from '@tfx-menu/tfx-menu';
import { from } from 'rxjs';

export const shortMenu: AppMenuConfig = {
  type: 'appMenu',
  options: {
    itemTextColor: '#ffffff',
    itemBackgroundColor: '#3f51b5',
    itemHighlightColor: '#283593',
  },
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
      disabled: from([false]),
    },
    {
      type: 'topLevelItem',
      label: 'Help',
    },
  ],
};
