import { SubMenuComponent } from '../menu-components/sub-menu/sub-menu.component';
import { MenuParent } from './menu-parent.type';
import { SubMenuChildItemProps, SubMenuProps } from './types';

/**
 * SubMenuData
 * ===========
 * Type of object used by SUB_MENU_DATA token. This token is used to pass data
 * into a dynamically instantiated SubMenuComponent. As sub-menus are created
 * by top-level menu items, items within sub-menus and by the context menu service
 * the menu parent could be an AppMenuComponent, a SubMenuComponent or a
 * ContextMenuService class instance
 *
 *  - subMenu:    properties that define a sub-menu
 *  - menuParent: reference to the parent of the sub-menu - can be an instance
 *                of any class implementing the MenuParent interface (at
 *                present AppMenuComponent, SubMenuComponent or ContextMenuService)
 */
export interface SubMenuData {
  subMenu: SubMenuProps;
  menuParent: MenuParent;
}

/**
 * MenuItemData
 * ============
 * Type of object used by the MENU_ITEM_DATA token. This token is used to pass
 * data into a dynamically instatiated sub-menu menu item (CheckboxItemComponent,
 * CommandItemComponent or SubMenuItemComponent).
 *
 *  - menuItem:       properties defining a menu item that can sit in a sub-menu
 *                    (checkbox, command or sub-menu item)
 *  - ownerMenuCmp:   reference to the SubMenuComponent that contains the menu
 *                    item
 */
export interface MenuItemData {
  menuItem: SubMenuChildItemProps;
  ownerMenuCmp: SubMenuComponent;
}
