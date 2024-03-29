/**
 * This results in a callback actor that manages opening and
 * closing a sub-menu popup.
 *
 * In order to manage the popup the callback requires the following
 * inputs:
 *
 *    - the "item" that expands the popup (TopLevelItemProps or SubMenuItemProps)
 *    - the parent menu component for the sub-menu that will occupy the popup
 *      (AppMenuComponent or SubMenuComponent)
 *    - an object containing the item components in the parent menu, keyed by
 *      the item id.
 *    - the PopupService instance used to manage popup UI
 */

import { ElementRef } from '@angular/core';
import { AnyEventObject, fromCallback } from 'xstate';
import { ItemComponentCollection } from '../../../item-component-collection';
import { PopupRef } from '../../../popup-service/popup-ref';
import { PopupService } from '../../../popup-service/popup-service';
import { MenuParent } from '../../../types/menu-parent.type';
import { ExecutableItemProps, ExpandableItemProps } from '../../../types/types';

export interface PopupCallbackInputs {
  expandedItem: ExpandableItemProps;
  menuParent: MenuParent;
  parentMenuItemCmps: ItemComponentCollection;
  popupService: PopupService;
}

export const popupLogic = fromCallback<
  { type: 'backdrop.click' },
  PopupCallbackInputs
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ sendBack, receive, input }) => {
    const { expandedItem, menuParent, parentMenuItemCmps, popupService } =
      input;
    let menuRef: PopupRef<ExecutableItemProps> | null = null;
    if (expandedItem && parentMenuItemCmps[expandedItem.id]) {
      menuRef = openMenu(
        expandedItem,
        menuParent,
        menuRef,
        parentMenuItemCmps[expandedItem.id].elementRef,
        popupService,
        sendBack
      );
    }

    return () => {
      closeMenu(menuRef);
    };
  }
);

const closeMenu = (menuRef: PopupRef<ExecutableItemProps> | null) => {
  if (menuRef) {
    menuRef.close();
  }
  return null;
};

const openMenu = (
  item: ExpandableItemProps,
  menuParent: MenuParent,
  menuRef: PopupRef<ExecutableItemProps> | null,
  anchorEl: ElementRef,
  popupService: PopupService,
  sendBack: (event: AnyEventObject) => void
): PopupRef<ExecutableItemProps> | null => {
  if (menuRef) {
    closeMenu(menuRef);
  }
  return popupService.openSubMenu(item.subMenu, menuParent, {
    associatedElement: anchorEl,
    positions: [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      },
    ],
    backdropClick: () => {
      sendBack({ type: 'backdrop.click' });
    },
  });
};
