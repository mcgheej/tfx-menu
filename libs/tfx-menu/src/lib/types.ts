import { Signal } from '@angular/core';

/**
 * MenuCategory
 * ============
 *
 * The different types of menu that the library exposes:
 *
 *  appMenu:      A menu that is typically displayed over a significant
 *                time period, often lasting the complete application
 *                lifetime. The appMenu contains a list of top-level
 *                menu items, each giving access to a subMenu. An appMenu
 *                is typically represented as a horizontal bar containing
 *                the top-level menu items but it can also be rendered
 *                as a vertical list in response to a smaller viewport
 *                size.
 *
 *  subMenu:      A menu that is displayed when a top-level menu item
 *                is clicked or the mouse cursor enters a sub-menu menu
 *                item.
 *
 *  contextMenu:  A menu that pops up when requested displaying menu
 *                items vertically. A context menu can contain sub-menu
 *                menu items giving the capability of configuring
 *                hierarchical menu structures.
 *
 */
export type MenuCategory = 'appMenu' | 'contextMenu' | 'subMenu';

/**
 * MenuOptionsProps
 * ================
 * TODO: add description
 */
export interface MenuOptionsProps {
  itemTextColor: string;
  disabledItemTextColor: string;
  itemBackgroundColor: string;
  itemHighlightColor: string;
  itemGroupSeparatorColor: string;
  fontSizePixels: number;
  outlinedIcons: boolean;
}

export type MenuOptions = Partial<MenuOptionsProps>;

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

export interface AppMenuProps {
  id: string;
  options: MenuOptions;
  topLevelItems: TopLevelItemConfig[];
  type: 'appMenu';
}

export type AppMenuConfig = Partial<Omit<AppMenuProps, 'type'>>;

/**
 * ContextMenuProps
 * ============
 * This interface defines the properties required to describe a
 * context menu.
 *
 *  id:             Unique identifier
 *  options:        Properties that control the appearance of the
 *                  menu - defined by a MenuOptions configuration
 *                  object
 *  itemGroups:     several groups of menu items- items will be
 *                  a mix of command menu items, checkbox menu items,
 *                  and sub-menu menu items
 *  type:           Identifies the type of menu - always 'contextMenu'
 */

export interface ContextMenuProps {
  id: string;
  options: MenuOptions;
  itemGroups: SubMenuGroupConfig[];
  type: 'contextMenu';
}

export type ContextMenuConfig = Partial<Omit<ContextMenuProps, 'type'>>;

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

export interface SubMenuProps {
  id: string;
  options: MenuOptions;
  itemGroups: SubMenuGroupConfig[];
  type: 'subMenu';
}

export type SubMenuConfig = Partial<Omit<SubMenuProps, 'type'>>;

/**
 * CheckboxItemProps
 * =================
 * This interface defines the properties for a checkbox menu item
 *
 *  id:       A unique identifier for the menu item
 *  label:    The label displayed for the menu item
 *  subLabel: A string showing the shortcut, if available,
 *            to execute the command
 *  disabled: Indicates whether or not the menu item is disabled
 *  visible:  Indicates whether or not the menu item is visible
 *  checked:  Indicates whether or not the command is checked
 *  exec:     A function provided by the client application
 *            that is executed when the menu item is clicked.
 *  type:     Identifies the type of the menu item -
 *            always 'checkboxItem'
 */
export interface CheckboxItemProps {
  id: string;
  label: string;
  subLabel: string;
  disabled: Signal<boolean>;
  visible: Signal<boolean>;
  checked: Signal<boolean>;
  exec: () => void;
  type: 'checkboxItem';
}

/**
 * CommandItemProps
 * ================
 * This interface defines the properties for a command menu item.
 *
 *  id:       A unique identifier for the menu item
 *  label:    The label displayed for the menu item
 *  subLabel: A string showing the shortcut, if available,
 *            to execute the command
 *  disabled: Indicates whether or not the menu item is disabled
 *  visible:  Indicates whether or not the menu item is visible
 *  exec:     A function provided by the client application
 *            that is executed when the menu item is clicked.
 *  type:     Identifies the type of the menu item -
 *            always 'commandItem'
 */
export interface CommandItemProps {
  id: string;
  label: string;
  subLabel: string;
  disabled: Signal<boolean>;
  visible: Signal<boolean>;
  exec: () => void;
  type: 'commandItem';
}

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

/**
 * TopLevelItemProps
 * =================
 * This interface defines the properties of a top level menu item.
 *
 *  id:       A unique identifier for the menu item
 *  label:    The label displayed for the menu item
 *  disabled: Indicates whether or not the menu item is disabled
 *  visible:  Indicates whether or not the menu item is visible
 *  subMenu:  Array of sub-menu group configurations. Each sub-menu
 *            group will contain a a combination of top-level menu
 *            items, checkbox menu items, and/or sub-menu menu
 *            items.
 *  type:     Identifies the type of the menu item - always 'topLevelItem'
 */
export interface TopLevelItemProps {
  id: string;
  label: string;
  disabled: Signal<boolean>;
  visible: Signal<boolean>;
  subMenu: SubMenuGroupConfig;
  type: 'topLevelItem';
}

export type CheckboxItemConfig = Partial<Omit<CheckboxItemProps, 'type'>>;

export type CommandItemConfig = Partial<Omit<CommandItemProps, 'type'>>;

export type SubMenuChildItemConfig =
  | CommandItemConfig
  | CheckboxItemConfig
  | SubMenuItemConfig;

export type SubMenuGroupConfig = SubMenuChildItemConfig[];

export type SubMenuItemConfig = Partial<Omit<SubMenuItemProps, 'type'>>;

export type TopLevelItemConfig = Partial<Omit<TopLevelItemProps, 'type'>>;
