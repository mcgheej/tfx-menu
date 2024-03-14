import { ConnectedPosition } from '@angular/cdk/overlay';
import { AnyEventObject, fromCallback } from 'xstate';
import { PopupRef } from '../../../popup-service/popup-ref';
import { PopupService } from '../../../popup-service/popup-service';
import { ContextPopupConfig } from '../../../types/context-popup-config.type';
import { MenuParent } from '../../../types/menu-parent.type';
import {
  ContextMenuProps,
  ExecutableItemProps,
  SubMenuProps,
} from '../../../types/types';

const DEFAULT_CONTEXT_MENU_POSITION: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  },
];

export interface PopupCallbackInputs {
  contextMenu: ContextMenuProps;
  menuParent: MenuParent;
  popupService: PopupService;
  popupConfig: ContextPopupConfig;
}

export const popupLogic = fromCallback<
  { type: 'backdrop.click' },
  PopupCallbackInputs
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ sendBack, receive, input }) => {
    const { contextMenu, menuParent, popupService, popupConfig } = input;
    let menuRef: PopupRef<ExecutableItemProps> | null = null;
    if (popupConfig.associatedElement) {
      menuRef = openMenu(
        { ...contextMenu, type: 'subMenu' },
        menuParent,
        menuRef,
        popupService,
        popupConfig,
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
  contextMenu: SubMenuProps,
  menuParent: MenuParent,
  menuRef: PopupRef<ExecutableItemProps> | null,
  popupService: PopupService,
  popupConfig: ContextPopupConfig,
  sendBack: (event: AnyEventObject) => void
): PopupRef<ExecutableItemProps> | null => {
  if (menuRef) {
    closeMenu(menuRef);
  }

  const config = { ...popupConfig };
  if (popupConfig.positions === undefined) {
    config.positions = [...DEFAULT_CONTEXT_MENU_POSITION];
  }
  return popupService.openSubMenu(contextMenu, menuParent, {
    ...config,
    backdropClick: () => {
      sendBack({ type: 'backdrop.click' });
    },
  });
};
