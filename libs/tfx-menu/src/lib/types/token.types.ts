import { AppMenuComponent } from '../menu-components/app-menu/app-menu.component';
import { ContextMenuService } from '../menu-components/context-menu/context-menu.service';
import { SubMenuComponent } from '../menu-components/sub-menu/sub-menu.component';
import { SubMenuChildItemProps, SubMenuProps } from './types';

export type MenuParent =
  | AppMenuComponent
  | SubMenuComponent
  | ContextMenuService;

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
  menuParent: MenuParent;
}

export interface MenuItemData {
  menuItem: SubMenuChildItemProps;
  subMenuParent: SubMenuComponent;
}
