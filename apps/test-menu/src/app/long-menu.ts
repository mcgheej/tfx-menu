import { AppMenuConfig } from '@tfx-menu/tfx-menu';
import { from } from 'rxjs';

export const longMenu: AppMenuConfig = {
  type: 'appMenu',
  topLevelItems: [
    {
      type: 'topLevelItem',
      label: 'Menu 1',
    },
    {
      type: 'topLevelItem',
      label: 'Menu 2',
      disabled: from([true]),
    },
    {
      type: 'topLevelItem',
      label: 'Menu 3',
    },
    {
      type: 'topLevelItem',
      label: 'Menu 4',
    },
  ],
};
