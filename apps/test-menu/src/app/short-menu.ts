import {
  AppMenuConfig,
  CheckboxItemConfig,
  CommandItemConfig,
  SubMenuConfig,
  SubMenuItemConfig,
} from '@tfx-menu/tfx-menu';
import { of } from 'rxjs';
import { autoSave$, fileOpen$, toggleAutoSave, updateFileOpen } from './store';

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
        name: 'File sub-menu',
        type: 'subMenu',
        itemGroups: [
          [
            {
              type: 'subMenuItem',
              label: 'New',
              subMenu: {
                name: 'File>New sub-menu',
                type: 'subMenu',
                itemGroups: [
                  [
                    {
                      type: 'commandItem',
                      label: 'File',
                      exec: () => console.log('Execute File>New>File command'),
                    } as CommandItemConfig,
                    {
                      type: 'commandItem',
                      label: 'Template',
                      exec: () =>
                        console.log('Execute File>New>Template command'),
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
                              exec: () =>
                                console.log(
                                  'Execute File>New>Sub-Menu>Command 1 command'
                                ),
                            } as CommandItemConfig,
                            {
                              type: 'checkboxItem',
                              label: 'Checkbox 1',
                              exec: () =>
                                console.log(
                                  'Execute File>New>Sub-Menu>Checkbox 1 checkbox'
                                ),
                            } as CheckboxItemConfig,
                            {
                              type: 'checkboxItem',
                              label: 'Checkbox 2',
                              exec: () =>
                                console.log(
                                  'Execute File>New>Sub-Menu>Checkbox 2 checkbox'
                                ),
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
              subLabel: 'Ctrl+O',
              exec: () => {
                console.log('Execute File>Open command');
                updateFileOpen(true);
              },
            } as CommandItemConfig,
            {
              type: 'checkboxItem',
              label: 'Auto Save',
              visible: fileOpen$,
              exec: () => {
                console.log('Execute File>Auto Save checked');
                toggleAutoSave();
              },
              checked: autoSave$,
            } as CheckboxItemConfig,
          ],
          [
            {
              type: 'commandItem',
              label: 'Exit',
              exec: () => {
                console.log('Execute File>Exit command');
                updateFileOpen(false);
              },
            } as CommandItemConfig,
          ],
        ],
      },
    },
    {
      type: 'topLevelItem',
      label: 'Edit',
      visible: fileOpen$,
      subMenu: {
        type: 'subMenu',
        itemGroups: [
          [
            {
              type: 'commandItem',
              label: 'Cut',
              subLabel: 'Ctrl+X',
              exec: () => console.log('Execute Edit>Cut command'),
            } as CommandItemConfig,
            {
              type: 'commandItem',
              label: 'Copy',
              subLabel: 'Ctrl+C',
              exec: () => console.log('Execute Edit>Copy command'),
            } as CommandItemConfig,
            {
              type: 'commandItem',
              label: 'Paste',
              subLabel: 'Ctrl+V',
              exec: () => console.log('Execute Edit>Paste command'),
              disabled: of(true),
            } as CommandItemConfig,
          ],
          [
            {
              type: 'commandItem',
              label: 'Delete',
              exec: () => console.log('Execute Edit>Delete command'),
            } as CommandItemConfig,
          ],
        ],
      },
    },
    {
      type: 'topLevelItem',
      label: 'Help',
      subMenu: {
        type: 'subMenu',
        itemGroups: [
          [
            {
              type: 'commandItem',
              label: 'About',
              exec: () => console.log('Execute Help>About command'),
            } as CommandItemConfig,
          ],
        ],
      },
    },
  ],
};
