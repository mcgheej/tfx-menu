/**
 * AppMenuProps
 * ============
 * This interface is defines the properties of a top level application
 * menu.
 *
 *  id:             Unique identifier
 *  options:        Properties that control the appearance of the
 *                  menu - defined by a MenuOptions configuration
 *                  object
 *  topLevelItems:  An array containing a configuration object
 *                  for each top level menu item in the application
 *                  menu.
 *  type:           Identifies the type of the menu - always
 *                  'appMenu'
 */

import { TopLevelItemConfig } from '../../menu-items/config-files/top-level-item-config.type';
import { MenuOptions } from '../config-files/menu-options.type';

export interface AppMenuProps {
  id: string;
  options: MenuOptions;
  topLevelItems: TopLevelItemConfig[];
  type: 'appMenu';
}
