import { setup } from 'xstate';
import { PopupService } from '../../../popup-service/popup-service';
import { ContextPopupConfig } from '../../../types/context-popup-config.type';
import { ContextMenuProps } from '../../../types/types';
import { ContextMenuService } from '../context-menu.service';
import { popupLogic } from './popup.xstate';

export interface ContextMenuContext {
  contextMenu: ContextMenuProps;
  contextMenuService: ContextMenuService;
  popupService: PopupService;
  popupConfig: ContextPopupConfig;
}

export type ContextMenuEvents =
  | { type: 'item.execute' }
  | { type: 'backdropClick' };

export const contextMenuMachine = setup({
  actors: {
    popupLogic,
  },
  types: {
    context: {} as ContextMenuContext,
    input: {} as {
      contextMenu: ContextMenuProps;
      contextMenuService: ContextMenuService;
      popupService: PopupService;
      popupConfig: ContextPopupConfig;
    },
    events: {} as ContextMenuEvents,
  },
  schemas: {
    events: {
      'item.execute': {
        type: 'object',
        properties: {},
      },
      'backdrop.click': {
        type: 'object',
        properties: {},
      },
    },
  },
}).createMachine({
  context: ({ input }) => ({
    contextMenu: input.contextMenu,
    contextMenuService: input.contextMenuService,
    popupService: input.popupService,
    popupConfig: input.popupConfig,
  }),
  id: 'contextMenu',
  initial: 'Starting',
  states: {
    Starting: {
      always: {
        target: 'menuVisible',
      },
    },
    menuVisible: {
      invoke: {
        id: 'popup',
        src: 'popupLogic',
        input: ({ context }) => {
          return {
            contextMenu: context.contextMenu,
            menuParent: context.contextMenuService,
            popupService: context.popupService,
            popupConfig: context.popupConfig,
          };
        },
      },
      on: {
        'item.execute': {
          target: 'Finished',
        },
        'backdrop.click': {
          target: 'Finished',
        },
      },
    },
    Finished: {
      type: 'final',
    },
  },
});
