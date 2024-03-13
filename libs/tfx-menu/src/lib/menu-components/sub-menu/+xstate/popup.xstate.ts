import { ElementRef } from '@angular/core';
import { fromCallback } from 'xstate';
import { ItemComponentCollection } from '../../../item-component-collection';
import { PopupRef } from '../../../popup-service/popup-ref';
import { PopupService } from '../../../popup-service/popup-service';
import { MenuParent } from '../../../types/token.types';
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
        popupService
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
  popupService: PopupService
): PopupRef<ExecutableItemProps> | null => {
  if (menuRef) {
    closeMenu(menuRef);
  }
  // TODO - positions will be different for sub-menu parents
  return popupService.openSubMenu(item.subMenu, menuParent, {
    hasBackdrop: false,
    associatedElement: anchorEl,
    positions: [
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
      },
    ],
    // backdropClick: () => {
    //   sendBack({ type: 'backdrop.click' });
    // },
  });
};
