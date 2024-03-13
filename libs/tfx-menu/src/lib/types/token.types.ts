import { AppMenuComponent } from '../menu-components/app-menu/app-menu.component';
import { SubMenuComponent } from '../menu-components/sub-menu/sub-menu.component';
import { SubMenuChildItemProps, SubMenuProps } from './types';

export type MenuComponent = AppMenuComponent | SubMenuComponent;

/**
 * SubMenuData
 * ===========
 * Type of object used by SUB_MENU_DATA token. This token is used to pass data
 * into a dynamically instantiated SubMenuComponent. As sub-menus are created
 * by top-level menu items and items within sub-menus the parent menu state machine
 * could be an app menu state machine or a sub-menu state machine.
 */
export interface SubMenuData {
  subMenu: SubMenuProps;
  parentMenu: MenuComponent;
}

export interface MenuItemData {
  menuItem: SubMenuChildItemProps;
  parentSubMenu: SubMenuComponent;
}
