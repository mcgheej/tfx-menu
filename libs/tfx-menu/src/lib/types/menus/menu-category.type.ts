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
