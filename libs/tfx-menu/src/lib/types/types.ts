import { Observable } from 'rxjs';
import { PartPartial } from './part-partial.type';

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

export type MenuOptionsConfig = Partial<MenuOptionsProps>;

/**
 * AppMenuProps
 * ============
 * This interface defines the properties of a top level application
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
  options: MenuOptionsProps;
  topLevelItems: TopLevelItemProps[];
  type: 'appMenu';
}

export interface AppMenuConfig {
  id?: string;
  options?: MenuOptionsConfig;
  topLevelItems?: TopLevelItemConfig[];
  type: 'appMenu';
}

/**
 * ContextMenuProps
 * ================
 * This interface defines the properties required to describe a
 * context menu.
 *
 *  id:             Unique identifier
 *  options:        Properties that control the appearance of the
 *                  menu - defined by a MenuOptions configuration
 *                  object
 *  itemGroups:     several groups of menu items - items will be
 *                  a mix of command menu items, checkbox menu items,
 *                  and sub-menu menu items
 *  type:           Identifies the type of menu - always 'contextMenu'
 */

export interface ContextMenuProps {
  id: string;
  options: MenuOptionsProps;
  itemGroups: SubMenuGroupProps[];
  type: 'contextMenu';
}

export interface ContextMenuConfig {
  id?: string;
  options?: MenuOptionsConfig;
  itemGroups?: SubMenuGroupConfig[];
  type: 'contextMenu';
}

/**
 * SubMenuProps
 * ============
 * This interface defines the properties required to describe a sub-menu.
 *
 *  id:             Unique identifier
 *  options:        Properties that control the appearance of the
 *                  menu - defined by a MenuOptions configuration
 *                  object
 *  itemGroups:     several groups of menu items - items will be
 *                  a mix of command menu items, checkbox menu items,
 *                  and sub-menu menu items
 *  type:           Identies the type of the menu - always 'subMenu'
 */

export interface SubMenuProps {
  id: string;
  name: string;
  options: MenuOptionsProps;
  itemGroups: SubMenuGroupProps[];
  type: 'subMenu';
}

export interface SubMenuConfig {
  id?: string;
  name?: string;
  options?: MenuOptionsConfig;
  itemGroups?: SubMenuGroupConfig[];
  type: 'subMenu';
}

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
  disabled: Observable<boolean>;
  visible: Observable<boolean>;
  checked: Observable<boolean>;
  exec: () => void;
  type: 'checkboxItem';
}

export type CheckboxItemConfig = PartPartial<CheckboxItemProps, 'type'>;

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
  disabled: Observable<boolean>;
  visible: Observable<boolean>;
  exec: () => void;
  type: 'commandItem';
}

export type CommandItemConfig = PartPartial<CommandItemProps, 'type'>;

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
  disabled: Observable<boolean>;
  visible: Observable<boolean>;
  type: 'subMenuItem';
  subMenu: SubMenuProps;
}

export interface SubMenuItemConfig {
  id?: string;
  label?: string;
  disabled?: Observable<boolean>;
  visible?: Observable<boolean>;
  type: 'subMenuItem';
  subMenu?: SubMenuConfig;
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
  disabled: Observable<boolean>;
  visible: Observable<boolean>;
  type: 'topLevelItem';
  subMenu: SubMenuProps;
}

export interface TopLevelItemConfig {
  id?: string;
  label?: string;
  disabled?: Observable<boolean>;
  visible?: Observable<boolean>;
  type: 'topLevelItem';
  subMenu?: SubMenuConfig;
}

/**
 *
 */
export type ExecutableItemProps = CommandItemProps | CheckboxItemProps;

export type ExpandableItemProps = TopLevelItemProps | SubMenuItemProps;

export type SubMenuChildItemProps =
  | CommandItemProps
  | CheckboxItemProps
  | SubMenuItemProps;

export type SubMenuChildItemConfig =
  | CommandItemConfig
  | CheckboxItemConfig
  | SubMenuItemConfig;

export type SubMenuGroupProps = SubMenuChildItemProps[];

export type SubMenuGroupConfig = SubMenuChildItemConfig[];
