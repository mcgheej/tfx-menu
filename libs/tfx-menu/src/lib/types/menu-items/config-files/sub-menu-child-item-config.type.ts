import { CheckboxItemConfig } from './checkbox-item-config.type';
import { CommandItemConfig } from './command-item-config.type';
import { SubMenuItemConfig } from './sub-menu-item-config.type';

export type SubMenuChildItemConfig =
  | CommandItemConfig
  | CheckboxItemConfig
  | SubMenuItemConfig;
