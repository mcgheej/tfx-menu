/**
 * MenuItemCategory
 * ================
 *
 * The different types of menu item that can appear in a menu hierarchy:
 *
 *  topLevelItem: This type of menu item only appears in the menu bar at
 *                the top of the menu hierarchy (appMenu). Only topLevelItem
 *                menu items are defined within an appMenu.
 *
 *  commandItem:  This type of menu item can appear in a subMenu or a contextMenu.
 *                As its name suggests clicking a command menu item should result
 *                in the execution of some functionality.
 *
 *  checkboxItem: This type of menu item is a special form of command item and can
 *                appear in a subMenu or a contextMenu. As its name suggests the
 *                menu item can be checked or unchecked (indicated by the presence
 *                or absence of a tick alongside the menu item's label). Typically
 *                clicking a checkbox menu item will execute some functionality
 *                provided by the application to toggle some behaviour identified by
 *                the checkbox item. For example, in a drawing application a checkbox
 *                menu item could be used to toggle whether or not a snap-to-grid
 *                feature was enabled or disabled. When enabled the checkbox menu
 *                item would have a tick displayed adjacent to the item label, otherwise
 *                the tick would be missing.
 *
 *  subMenuItem:  A sub-menu item opens an associated subMenu when the user moves
 *                the cursor over the sub-menu item.
 *
 */
export type MenuItemCategory =
  | 'commandItem'
  | 'subMenuItem'
  | 'checkboxItem'
  | 'topLevelItem';
