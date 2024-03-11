import { ElementRef } from '@angular/core';
import { fromCallback } from 'xstate';
import { ItemComponentCollection } from '../../../item-component-collection';
import { PopupRef } from '../../../popup-service/popup-ref';
import { PopupService } from '../../../popup-service/popup-service';
import { MenuComponent } from '../../../token.types';
import { ExecutableItemProps, ExpandableItemProps } from '../../../types';

export interface PopupCallbackInputs {
  expandedItem: ExpandableItemProps;
  parentMenuCmp: MenuComponent;
  parentMenuItemCmps: ItemComponentCollection;
  popupService: PopupService;
}

export const popupLogic = fromCallback<
  { type: 'backdrop.click' },
  PopupCallbackInputs
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ sendBack, receive, input }) => {
    const { expandedItem, parentMenuCmp, parentMenuItemCmps, popupService } =
      input;
    let menuRef: PopupRef<ExecutableItemProps> | null = null;
    if (expandedItem && parentMenuItemCmps[expandedItem.id]) {
      menuRef = openMenu(
        expandedItem,
        parentMenuCmp,
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
  parentMenuCmp: MenuComponent,
  menuRef: PopupRef<ExecutableItemProps> | null,
  anchorEl: ElementRef,
  popupService: PopupService
): PopupRef<ExecutableItemProps> | null => {
  if (menuRef) {
    closeMenu(menuRef);
  }
  // TODO - positions will be different for sub-menu parents
  return popupService.openSubMenu(item.subMenu, parentMenuCmp, {
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
