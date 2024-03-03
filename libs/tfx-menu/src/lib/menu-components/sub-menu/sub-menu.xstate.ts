import { assign, setup } from 'xstate';
import { SubMenuChildItemProps, SubMenuProps } from '../../types';

export const noItemActive = 'No item active';
export const noItemHighlighted = 'No item highlighted';

export interface SubMenuContext {
  subMenu: SubMenuProps;
  activeItem: SubMenuChildItemProps | null;
  highlightedItem: SubMenuChildItemProps | null;
}

export type SubMenuEvents =
  | { type: 'item.enter'; item: SubMenuChildItemProps }
  | { type: 'item.leave'; item: SubMenuChildItemProps }
  | { type: 'overSubMenu'; item: SubMenuChildItemProps }
  | { type: 'item.execute' }
  | { type: 'backdrop.click' };

export const subMenuMachine = setup({
  types: {
    context: {} as SubMenuContext,
    input: {} as { subMenu: SubMenuProps },
    events: {} as SubMenuEvents,
  },
  actions: {
    setActiveItem: assign({
      activeItem: ({ context, event }) => {
        if (event.type === 'item.enter') {
          if (event.item) {
            return event.item;
          }
          return null;
        }
        return context.activeItem;
      },
    }),
    setHighlight: assign({
      highlightedItem: ({ context, event }) => {
        if (event.type === 'item.enter') {
          if (event.item) {
            return event.item;
          }
          return null;
        }
        return context.activeItem;
      },
    }),
    clearHighlight: assign({ highlightedItem: () => null }),
    clearActiveItem: assign({ activeItem: () => null }),
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
    itemIsSubMenuItem: function ({ context }) {
      return false;
      // return context.activeItem?.type === 'subMenuItem';
    },
    itemIsActiveItem: function ({ context, event }) {
      if (event.type === 'item.enter' && context.activeItem) {
        if (context.activeItem.id === event.item.id) {
          return true;
        }
      }
      return false;
    },
  },
  schemas: {
    events: {
      'item.enter': {
        type: 'object',
        properties: {},
      },
      'item.leave': {
        type: 'object',
        properties: {},
      },
      overSubMenu: {
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
  context: ({ input }) => ({
    subMenu: input.subMenu,
    activeItem: null,
    highlightedItem: null,
  }),
  id: 'subMenu',
  initial: 'noActiveItem',
  states: {
    noActiveItem: {
      on: {
        'item.enter': {
          target: 'activeItem',
        },
      },
    },
    activeItem: {
      initial: 'activeMenuItem',
      on: {
        'item.leave': {
          target: 'noActiveItem',
        },
        'backdrop.click': {
          target: 'noActiveItem',
        },
        'item.enter': {
          target: 'activeItem',
          reenter: true,
        },
      },
      entry: [
        {
          type: 'setActiveItem',
        },
        {
          type: 'setHighlight',
        },
      ],
      exit: [
        {
          type: 'clearHighlight',
        },
        {
          type: 'clearActiveItem',
        },
      ],
      states: {
        activeMenuItem: {
          on: {
            'item.execute': {
              target: '#subMenu.noActiveItem',
            },
          },
          always: {
            target: 'activeSubMenuItem',
            guard: {
              type: 'itemIsSubMenuItem',
            },
          },
        },
        activeSubMenuItem: {
          initial: 'waitToOpen',
          on: {
            'item.execute': {
              target: '#subMenu.noActiveItem',
            },
          },
          states: {
            waitToOpen: {
              after: {
                '300': {
                  target: 'subMenuVisible',
                },
              },
            },
            subMenuVisible: {
              initial: 'preview',
              entry: {
                type: 'openSubMenu',
              },
              exit: {
                type: 'closeSubMenu',
              },
              states: {
                preview: {
                  on: {
                    'item.leave': {
                      target: 'closing',
                    },
                  },
                },
                closing: {
                  on: {
                    overSubMenu: {
                      target: 'open',
                    },
                    'item.enter': {
                      target: 'preview',
                      guard: {
                        type: 'itemIsActiveItem',
                      },
                    },
                  },
                  after: {
                    '600': {
                      target: '#subMenu.noActiveItem',
                    },
                  },
                  entry: {
                    type: 'clearHighlight',
                  },
                  exit: {
                    type: 'setHighlight',
                  },
                },
                open: {
                  on: {
                    'item.enter': {
                      target: 'preview',
                      guard: {
                        type: 'itemIsActiveItem',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});
