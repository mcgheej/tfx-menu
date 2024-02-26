import { assign, setup } from 'xstate';
import { AppMenuProps, TopLevelItemProps } from '../types';

export const noItemActive = 'No item active';

export interface AppMenuContext {
  appMenu: AppMenuProps;
  activeItem: TopLevelItemProps | null;
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
    openSubMenu: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    closeSubMenu: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
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
  context: ({ input }) => ({ appMenu: input.appMenu, activeItem: null }),
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
