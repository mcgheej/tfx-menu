import { Signal } from '@angular/core';
import { SubMenuGroupConfig } from '../config-files/sub-menu-group-config.type';

/**
 * SubMenuItemProps
 * ================
 * This interface defines the properties of a sub-menu menu item.
 *
 *  id:       A unique identifier for the menu item
 *  label:    The label displayed for the menu item
 *  disabled: Indicates whether or not the menu item is disabled
 *  visible:  Indicates whether or not the menu item is visible
 *  subMenu:  Array of sub-menu group configurations. Each sub-menu
 *            group will contain a a combination of top-level menu
 *            items, checkbox menu items, and/or sub-menu menu
 *            items.
 *  type:     Identifies the type of the menu item -
 *            always 'subMenuItem'
 */
export interface SubMenuItemProps {
  id: string;
  label: string;
  disabled: Signal<boolean>;
  visible: Signal<boolean>;
  subMenu: SubMenuGroupConfig;
  type: 'subMenuItem';
}