import { assign, setup } from 'xstate';
import { ItemComponentCollection } from '../../../item-component-collection';
import { PopupService } from '../../../popup-service/popup-service';
import { AppMenuProps, TopLevelItemProps } from '../../../types/types';
import { AppMenuComponent } from '../app-menu.component';
import { PopupCallbackInputs, popupLogic } from './popup.xstate';

export const noItemActive = 'No item active';
export const noItemExpanded = 'No item expanded';

export interface AppMenuContext {
  appMenu: AppMenuProps;
  appMenuCmp: AppMenuComponent;
  menuItemCmps: ItemComponentCollection;
  popupService: PopupService;
  activeItem: TopLevelItemProps | null;
}

export type AppMenuEvents =
  | { type: 'topLevelItem.click'; item: TopLevelItemProps }
  | { type: 'topLevelItem.enter'; item: TopLevelItemProps }
  | { type: 'topLevelItem.leave'; item: TopLevelItemProps }
  | { type: 'item.execute' }
  | { type: 'backdrop.click' }
  | { type: 'menu.itemComponentsChange'; itemCmps: ItemComponentCollection };

export const appMenuMachine = setup({
  actors: {
    popupLogic,
  },
  types: {
    context: {} as AppMenuContext,
    input: {} as {
      appMenu: AppMenuProps;
      appMenuCmp: AppMenuComponent;
      popupService: PopupService;
    },
    events: {} as AppMenuEvents,
  },
  actions: {
    setItemComponents: assign({
      menuItemCmps: ({ context, event }) => {
        if (event.type === 'menu.itemComponentsChange') {
          return event.itemCmps;
        }
        return context.menuItemCmps;
      },
    }),
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
      'menu.itemComponentsChange': {
        type: 'object',
        properties: {},
      },
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqCyYB2BXAxALY64B0AlgC5iEDCA9oavdjpbLQBbLYwDaABgC6iUM1hVyLUSAAeiAIwKAnANIB2AKxLlAZnUAOTQBZdAJmMAaEAE9EAWk2bSxk+oUH3ZhQDZ1AgwBfQOs0TBJSbHpKAEEAY0pyADcwfEp6VAAZMBSAGwBJakJSNjAAJ0ERJBBxSWlq+QR9DWMzbU0zAV1jHt1dazsEYxVSfQ8BTXVlMx8e4ND0LDxSZATksEjogFFZVB4ISDSM7LzCmlJcsGQUyplaxPrQRuaDCYEzf00-YwEugcRusZRj5VG8fH5NMplPMQGElmRVokUptKDs9tgDhAjlkcmACkVSHFcuQ4gBrW7Ve5SbAyRrGZTqUgGXQ+AwKNoCZSaXQBf5DMzKUjeGYKczM-Ss9QwuERRHrEq7faHdI404Eokk8nCO70CQPGkNRD0xnM1nszSc7m82wA0WkAReCzaZStAwzaWLWVrZFgRUYw5Uc6+sBxXDUCliXV1A1PRCQoVsyaaAx+czJqw2hA+AQ+Uhc9w+FnqXQpl0e8LLOU+v2Y7EnPFnYqlCraylR-W0xCeBRMzou9zTIymPm6O0O9lOlSu3Tl+Erb0bX3o2sAI1WpIgZQyhOJZIjNXb1M7CHUWlGUNHyh8TimLL54LU405fcMHWCIRAUQO8GqMrwOr1I9DQQexfEZVps3UHooTdHwFAzQZr3tLwWTdZMAjMWcIiiWIFwA6Nj1AkYIIdaDlFg+C+WGQUxleK9IS6U8sMrPC20Ax45EQD5BXgn4LAMAxWkhfpMwUDpSEmdldAZcxsy6HxmIRBcUTRJUIHwjtgPMRlePeYwBKEvQqIFIV2TgsU+nUVlFPnJFFxrSANKA2MTxMwsxh6a8jHIqi+hcblnVcFlJPfQIgA */
  context: ({ input }) => ({
    appMenu: input.appMenu,
    appMenuCmp: input.appMenuCmp,
    menuItemCmps: {},
    popupService: input.popupService,
    activeItem: null,
  }),
  id: 'appMenu',
  initial: 'notActive',
  on: {
    'menu.itemComponentsChange': {
      actions: 'setItemComponents',
    },
  },
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
          invoke: {
            id: 'popup',
            src: 'popupLogic',
            input: ({ context }) => {
              return {
                expandedItem: context.activeItem,
                menuParent: context.appMenuCmp,
                parentMenuItemCmps: context.menuItemCmps,
                popupService: context.popupService,
              } as PopupCallbackInputs;
            },
          },
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
          ],
        },
      },
    },
  },
});
