import { InjectionToken } from '@angular/core';
import { MenuItemData, SubMenuData } from './token.types';

export const SUB_MENU_DATA = new InjectionToken<SubMenuData>('SUB_MENU_DATA');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MENU_ITEM_DATA = new InjectionToken<MenuItemData>(
  'MENU_ITEM_DATA'
);
