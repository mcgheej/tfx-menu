import { signal } from '@angular/core';
import { nanoid } from 'nanoid';
import {
  AppMenuConfig,
  AppMenuProps,
  CheckboxItemConfig,
  CommandItemConfig,
  MenuOptions,
  MenuOptionsProps,
  SubMenuConfig,
  SubMenuGroupConfig,
  SubMenuItemConfig,
  SubMenuProps,
  TopLevelItemConfig,
  TopLevelItemProps,
} from '../types';

const APP_MENU_DEFAULT_OPTIONS: MenuOptionsProps = {
  itemTextColor: '#ffffff',
  disabledItemTextColor: '#aaaaaa',
  itemBackgroundColor: '#008000',
  itemHighlightColor: '#006000',
  itemGroupSeparatorColor: '#aaaaaa',
  fontSizePixels: 13,
  outlinedIcons: false,
};

const SUB_MENU_DEFAULT_OPTIONS: MenuOptionsProps = {
  itemTextColor: '#212121',
  disabledItemTextColor: '#aaaaaa',
  itemBackgroundColor: '#ffffff',
  itemHighlightColor: '#cccccc',
  itemGroupSeparatorColor: '#aaaaaa',
  fontSizePixels: 13,
  outlinedIcons: false,
};

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
          disabled: item.disabled ?? signal(false).asReadonly(),
          visible: item.visible ?? signal(true).asReadonly(),
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
): SubMenuGroupConfig[] {
  return itemGroups
    ? itemGroups.map((group) => topupItemGroupConfig(group))
    : [];
}

function topupItemGroupConfig(group: SubMenuGroupConfig): SubMenuGroupConfig {
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

function topupCommandItemConfig(item: CommandItemConfig): CommandItemConfig {
  return {
    id: item.id ?? nanoid(),
    label: item.label ?? 'Unknown',
    subLabel: item.subLabel ?? '',
    disabled: item.disabled ?? signal(false).asReadonly(),
    visible: item.visible ?? signal(true).asReadonly(),
    exec: item.exec ?? (() => undefined),
    type: 'commandItem',
  };
}

function topupCheckboxItemConfig(item: CheckboxItemConfig): CheckboxItemConfig {
  return {
    id: item.id ?? nanoid(),
    label: item.label ?? 'Unknown',
    subLabel: item.subLabel ?? '',
    disabled: item.disabled ?? signal(false).asReadonly(),
    visible: item.visible ?? signal(true).asReadonly(),
    checked: item.checked ?? signal(false).asReadonly(),
    exec: item.exec ?? (() => undefined),
    type: 'checkboxItem',
  };
}

function topupSubMenuItemConfig(item: SubMenuItemConfig): SubMenuItemConfig {
  return {
    id: item.id ?? nanoid(),
    label: item.label ?? 'Unknown',
    disabled: item.disabled ?? signal(false).asReadonly(),
    visible: item.visible ?? signal(true).asReadonly(),
    subMenu: topupSubMenuConfig(item.subMenu),
    type: 'subMenuItem',
  };
}

function topupMenuOptions(
  options: MenuOptions | undefined,
  defaults: MenuOptionsProps
): MenuOptionsProps {
  return options ? { ...defaults, ...options } : { ...defaults };
}
