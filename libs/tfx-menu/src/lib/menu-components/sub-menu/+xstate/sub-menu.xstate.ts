import { assign, setup } from 'xstate';
import { ItemComponentCollection } from '../../../item-component-collection';
import { PopupService } from '../../../popup-service/popup-service';
import { SubMenuChildItemProps, SubMenuProps } from '../../../types';
import { SubMenuComponent } from '../sub-menu.component';
import { PopupCallbackInputs, popupLogic } from './popup.xstate';

export const noItemActive = 'No item active';
export const noItemHighlighted = 'No item highlighted';

export interface SubMenuContext {
  subMenu: SubMenuProps;
  subMenuCmp: SubMenuComponent;
  menuItemCmps: ItemComponentCollection;
  popupService: PopupService;
  activeItem: SubMenuChildItemProps | null;
  highlightedItem: SubMenuChildItemProps | null;
}

export type SubMenuEvents =
  | { type: 'item.enter'; item: SubMenuChildItemProps }
  | { type: 'item.leave'; item: SubMenuChildItemProps }
  | { type: 'childSubMenu.enter' }
  | { type: 'item.execute' }
  | { type: 'backdrop.click' }
  | { type: 'subMenu.itemComponentsChange'; itemCmps: ItemComponentCollection };

export const subMenuMachine = setup({
  actors: {
    popupLogic,
  },
  types: {
    context: {} as SubMenuContext,
    input: {} as {
      subMenu: SubMenuProps;
      subMenuCmp: SubMenuComponent;
      popupService: PopupService;
    },
    events: {} as SubMenuEvents,
  },
  actions: {
    setItemComponents: assign({
      menuItemCmps: ({ context, event }) => {
        if (event.type === 'subMenu.itemComponentsChange') {
          return event.itemCmps;
        }
        return context.menuItemCmps;
      },
    }),
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
  },
  guards: {
    itemIsSubMenuItem: function ({ context }) {
      return context.activeItem?.type === 'subMenuItem';
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
      'childSubMenu.enter': {
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
      'subMenu.itemComponentsChange': {
        type: 'object',
        properties: {},
      },
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwK4CMCyYB2KB02A9gIIDGALgJYBuYAkuWALYDEljTeOjATgNoAGALqJQAB0Kx2lQtlEgAHogC0ARlUAWAMx4ATAA4BA1VoCsANl0D9G3QBoQATxWnDeUwHZrHgJw-zqn5aWgC+IQ6omDj4AIYUNPQcbBx4ADZgMbSCIkggElJUsvJKCGqaOrqqHqYmpqb+5gLmDs6ltrp6qgKmuh4a1eZ1YRHoWLh4cVS0DMwsaHEA1hA8hGJ4pKmUpAvZ8vnSRbklZfV4VU1aPlX6vebNTiq9GniN+prmHn3mGpqmwyCRMaxeLTJLsZhcbC8Xa5faFORHFymZ79fQ+AS6LRotHmfQtFT6TydXQknz6ALmLT9f6A6ITEGJWbgzhgBRgUgoRgw8SSA4I0DHdSmHTdKmmAQ-Yw3ewPUqqKw00Z0yYJGacFW0IFqljcvK8+HFFQfDzuCXBCkCXzy-GlGo+M6XHyVLRGSmaRVRcYaxnqhkAZSVuDVeAA7jF2AAVQgAeTEOBYClg5BijAmADNeAAKF0CACULFpXoZwe9Ac9KGDYcjMbj2F1cJk-MUKlUFlNrk+3yalR8HhtylsJp8PQlHkp3zMVI9QPpUx9s4SZa1KULKAAapQpGh0ngxDwwNRKGAQ8kIelMmB6-rG4bSrc8IYNLjO1i7v35XgfBoNMZPpVXgEHjTsqxYpKWgYViuEEbluO4bLy2BQCwhC0DwS7RFeBQ3oid51Ho+jBH0mhjh4VI2roT6fvoXitoSXS6IMwFFnOJb+hBwarjBlDbmA6ypAhSHMpC0LCHs16HAKKh9GcmI9IYqj6ARZL3K0yhWJ+36-h4-7WN8fzhACEELqCELgeWHHQZu3FwfxUiIQmSYprxMQZmAPCZo0eYFkZ3qsXO6FBlB5ZcTxfECZhfK3mUtjuDmtTBEY1qyiYOgER4qh3L04oaH4+hMcCLFgWx5lBUCIU7qs8ZCdwbkRQaOHKK4LwShiWjaf4Vyke+X4vH4v5vJi3QZWEBlEBAcDyKuYlYRJzZyj8Q6eIOrZtRlWj9l+zzpSSujKWt1IGauBAkKBzDTZFDUmOY9rDn0vQrellL9q4AjuF41F+AEQShIdPmnUw531ZJpToh0dQ+FidRLVoFH9p8+idN0TwDEMv3lsZ87esuZ2wuJTbHISzzg5DdR9DDGjPZUeBYn4drjjcGj5RjfmLuxHCA9hwMDgxeBfF41itd8PjPYMvNdD0fQo-pIzo75RX+WzEJVuQUaxjgHOzccbUI3zRiGJiQv9qiiMS-0FiozLM5y6ZxXY5wnFWTxGv4yoMP2t+d2XOSGjeyprt4YE6LXPKLo1OYTPW76CslRCDuwbxe4HkeIbO1FvQCO+Cpo1b-0YwFkGx5Z8dhXZUCpw1BiqHgHu2F73y+zaw4Pqt9fGCOugR7nZl23gcfWbxlVNg2muIAYr3fgYyL0YTMqtCYHSEbU1E7aRHcjUAA */
  context: ({ input }) => ({
    subMenu: input.subMenu,
    subMenuCmp: input.subMenuCmp,
    menuItemCmps: {},
    popupService: input.popupService,
    activeItem: null,
    highlightedItem: null,
  }),
  id: 'subMenu',
  initial: 'noActiveItem',
  on: {
    'subMenu.itemComponentsChange': {
      actions: 'setItemComponents',
    },
  },
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
        'item.execute': {
          target: '#subMenu.noActiveItem',
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
          // on: {
          //   'item.execute': {
          //     target: '#subMenu.noActiveItem',
          //   },
          // },
          always: {
            target: 'activeSubMenuItem',
            guard: {
              type: 'itemIsSubMenuItem',
            },
          },
        },
        activeSubMenuItem: {
          initial: 'waitToOpen',
          // on: {
          //   'item.execute': {
          //     target: '#subMenu.noActiveItem',
          //   },
          // },
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
              invoke: {
                id: 'popup',
                src: 'popupLogic',
                input: ({ context }) => {
                  return {
                    expandedItem: context.activeItem,
                    parentMenuCmp: context.subMenuCmp,
                    parentMenuItemCmps: context.menuItemCmps,
                    popupService: context.popupService,
                  } as PopupCallbackInputs;
                },
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
                    'childSubMenu.enter': {
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
