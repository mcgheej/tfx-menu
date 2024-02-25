import { nanoid } from 'nanoid';
import { from } from 'rxjs';
import {
  AppMenuConfig,
  AppMenuProps,
  CheckboxItemConfig,
  CheckboxItemProps,
  CommandItemConfig,
  CommandItemProps,
  MenuOptionsConfig,
  MenuOptionsProps,
  SubMenuConfig,
  SubMenuGroupConfig,
  SubMenuGroupProps,
  SubMenuItemConfig,
  SubMenuItemProps,
  SubMenuProps,
  TopLevelItemConfig,
  TopLevelItemProps,
} from '../types';
import {
  APP_MENU_DEFAULT_OPTIONS,
  SUB_MENU_DEFAULT_OPTIONS,
} from './menu-defaults';

/**
 *
 * @param config - menu configuration provided by application (type
 *                  AppMenuConfig)
 * @returns - Fully populated app menu properties
 *
 * The AppMenuConfig object defines the complete menu hierarchy. This function,
 * with associated support functions in this file, fill in the gaps left
 * in the configuration by the application programmer using default values.
 */
export function topupAppMenuConfig(config: AppMenuConfig): AppMenuProps {
  return {
    id: config.id ?? nanoid(),
    options: topupMenuOptions(config.options, APP_MENU_DEFAULT_OPTIONS),
    topLevelItems: topupTopLevelItemsConfig(config.topLevelItems),
    type: 'appMenu',
  };
}

/**
 *
 * @param topLevelItems - array of top-level item configurations
 * @returns - array of top-level item properties
 */
function topupTopLevelItemsConfig(
  topLevelItems: TopLevelItemConfig[] | undefined
): TopLevelItemProps[] {
  return topLevelItems
    ? topLevelItems.map((item) => {
        return {
          id: item.id ?? nanoid(),
          label: item.label ?? '',
          disabled: item.disabled ?? from([false]),
          visible: item.visible ?? from([true]),
          subMenu: topupSubMenuConfig(item.subMenu),
          type: 'topLevelItem',
        } as TopLevelItemProps;
      })
    : [];
}

function topupSubMenuConfig(subMenu: SubMenuConfig | undefined): SubMenuProps {
  return subMenu
    ? {
        id: subMenu.id ?? nanoid(),
        options: topupMenuOptions(subMenu.options, SUB_MENU_DEFAULT_OPTIONS),
        itemGroups: topupItemGroupsConfig(subMenu.itemGroups),
        type: 'subMenu',
      }
    : {
        id: nanoid(),
        options: { ...SUB_MENU_DEFAULT_OPTIONS },
        itemGroups: [],
        type: 'subMenu',
      };
}

function topupItemGroupsConfig(
  itemGroups: SubMenuGroupConfig[] | undefined
): SubMenuGroupProps[] {
  return itemGroups
    ? itemGroups.map((group) => topupItemGroupConfig(group))
    : [];
}

function topupItemGroupConfig(group: SubMenuGroupConfig): SubMenuGroupProps {
  return group.map((item) => {
    switch (item.type) {
      case 'commandItem': {
        return topupCommandItemConfig(item as CommandItemConfig);
      }
      case 'checkboxItem': {
        return topupCheckboxItemConfig(item as CheckboxItemConfig);
      }
      default: {
        return topupSubMenuItemConfig(item as SubMenuItemConfig);
      }
    }
  });
}

function topupCommandItemConfig(item: CommandItemConfig): CommandItemProps {
  return {
    id: item.id ?? nanoid(),
    label: item.label ?? 'Unknown',
    subLabel: item.subLabel ?? '',
    disabled: item.disabled ?? from([false]),
    visible: item.visible ?? from([true]),
    exec: item.exec ?? (() => undefined),
    type: 'commandItem',
  };
}

function topupCheckboxItemConfig(item: CheckboxItemConfig): CheckboxItemProps {
  return {
    id: item.id ?? nanoid(),
    label: item.label ?? 'Unknown',
    subLabel: item.subLabel ?? '',
    disabled: item.disabled ?? from([false]),
    visible: item.visible ?? from([true]),
    checked: item.checked ?? from([false]),
    exec: item.exec ?? (() => undefined),
    type: 'checkboxItem',
  };
}

function topupSubMenuItemConfig(item: SubMenuItemConfig): SubMenuItemProps {
  return {
    id: item.id ?? nanoid(),
    label: item.label ?? 'Unknown',
    disabled: item.disabled ?? from([false]),
    visible: item.visible ?? from([true]),
    subMenu: topupSubMenuConfig(item.subMenu),
    type: 'subMenuItem',
  };
}

function topupMenuOptions(
  options: MenuOptionsConfig | undefined,
  defaults: MenuOptionsProps
): MenuOptionsProps {
  return options ? { ...defaults, ...options } : { ...defaults };
}
