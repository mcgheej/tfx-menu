/**
 * SubMenuProps
 * ============
 * This interface defines the properties required to describe a sub-menu.
 *
 *  id:             Unique identifier
 *  options:        Properties that control the appearance of the
 *                  menu - defined by a MenuOptions configuration
 *                  object
 *  itemGroups:     several groups of menu items- items will be
 *                  a mix of command menu items, checkbox menu items,
 *                  and sub-menu menu items
 *  type:           Identies the type of the menu - always 'subMenu'
 */

import { SubMenuGroupConfig } from '../../menu-items/config-files/sub-menu-group-config.type';
import { MenuOptions } from '../config-files/menu-options.type';

export interface SubMenuProps {
  id: string;
  options: MenuOptions;
  itemGroups: SubMenuGroupConfig[];
  type: 'subMenu';
}