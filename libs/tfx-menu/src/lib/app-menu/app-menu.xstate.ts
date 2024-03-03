import { assign, setup } from 'xstate';
import { AppMenuProps, TopLevelItemProps } from '../types';

export const noItemActive = 'No item active';
export const noItemExpanded = 'No item expanded';

export interface AppMenuContext {
  appMenu: AppMenuProps;
  activeItem: TopLevelItemProps | null;
  expandedItem: TopLevelItemProps | null;
}

export type AppMenuEvents =
  | { type: 'topLevelItem.click'; item: TopLevelItemProps }
  | { type: 'topLevelItem.enter'; item: TopLevelItemProps }
  | { type: 'topLevelItem.leave'; item: TopLevelItemProps }
  | { type: 'item.execute' }
  | { type: 'backdrop.click' };

export const appMenuMachine = setup({
  types: {
    context: {} as AppMenuContext,
    input: {} as { appMenu: AppMenuProps },
    events: {} as AppMenuEvents,
  },
  actions: {
    activateItem: assign({
      activeItem: ({ context, event }) => {
        if (
          event.type === 'topLevelItem.enter' ||
          event.type === 'topLevelItem.click'
        ) {
          if (event.item) {
            return event.item;
          }
          return null;
        }
        return context.activeItem;
      },
    }),
    deactivateItem: assign({
      activeItem: () => null,
    }),
    openSubMenu: assign({
      expandedItem: ({ context, event }) => {
        if (
          event.type === 'topLevelItem.enter' ||
          event.type === 'topLevelItem.click'
        ) {
          if (event.item) {
            return event.item;
          }
          return null;
        }
        return context.expandedItem;
      },
    }),
    closeSubMenu: assign({
      expandedItem: () => null,
    }),
  },
  guards: {
    itemNotActiveItem: function ({ context, event }) {
      if (event.type === 'topLevelItem.enter' && context.activeItem) {
        if (context.activeItem.id !== event.item.id) {
          return true;
        }
      }
      return false;
    },
  },
  schemas: {
    events: {
      'topLevelItem.click': {
        type: 'object',
        properties: {},
      },
      'topLevelItem.enter': {
        type: 'object',
        properties: {},
      },
      'topLevelItem.leave': {
        type: 'object',
        properties: {},
      },
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
  /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqCyYB2BXAdNgPYAuAggMYkCWAbmAMQlGoAyY9ANgJIlgC2+HHwBOAbQAMAXUShURWNRpFsskAA9EAVgBMAGhABPRAA4AjPgAsATlvWt1gMxnrANleWdAXy8G0mHAJkKjowQlIAUXVUZGwISCYWdi5eAXxOMGR6SRkkEHlFZVU8zQQAdhNLfHtnEx1dMxNdVwNjBEcdKps7LRNXRsszLR8-dCw8fGCaenCSKJi4hOY2DjAePkEKTmoKAGsctQKlahU1Us6taolXHQ8y1zdXE0cTVu1LMvx6iQkdR2sJJYPhURiB-OMgiEZmBorF4hBEisUht8FsdvtpIcFMdTiVEBcrjc7g93M9XkZEDZXPgylofjoJGZGo5HGVrJZQeDApMoWEYQt4QwlGkYWAKLg+Ac8kcimdEBUqjVGvUdI1mm8EM18M8WTYhn8zDpvL4wWNuVNQkJYYsEctkmtUoJhGBxJjpdjZXiEJ5qc56mZLICdLSTGUNUDLp07GVaXqA5yzRMLdDrYKAEbBXYQEQsVHbPZSuQek7FUClBXVLS1FVq24arQx-Aslm6JyVXTGk3EeLwPJcvBYwoluUIAC01g1o9cCYCE2I5F5g5xpY0iGsTRpjRMEg6llcHTDFPaHSb3TcnUBWivHJN-ch0zAS89ZcQ-w1OkqNLPFW+jn3M4hHkH1meY4UgJ9hy9UN6z-bVaV+HR7DZTxrAA81eStAVwPdIdcRfb1nmqSwqwaQZLEcQZDzaOkJBpGjGS0QYJC0MxHB8HwgA */
  context: ({ input }) => ({
    appMenu: input.appMenu,
    activeItem: null,
    expandedItem: null,
  }),
  id: 'appMenu',
  initial: 'notActive',
  states: {
    notActive: {
      on: {
        'topLevelItem.enter': {
          target: 'active',
        },
      },
    },
    active: {
      initial: 'notExpanded',
      entry: [
        {
          type: 'activateItem',
        },
      ],
      exit: [
        {
          type: 'deactivateItem',
        },
      ],
      states: {
        notExpanded: {
          on: {
            'topLevelItem.leave': {
              target: '#appMenu.notActive',
            },
            'topLevelItem.click': {
              target: 'expanded',
            },
          },
        },
        expanded: {
          on: {
            'topLevelItem.click': {
              target: 'notExpanded',
            },
            'item.execute': {
              target: '#appMenu.notActive',
            },
            'topLevelItem.enter': {
              target: 'expanded',
              reenter: true,
              guard: {
                type: 'itemNotActiveItem',
              },
            },
            'backdrop.click': {
              target: '#appMenu.notActive',
            },
          },
          entry: [
            {
              type: 'activateItem',
            },
            {
              type: 'openSubMenu',
            },
          ],
          exit: {
            type: 'closeSubMenu',
          },
        },
      },
    },
  },
});
