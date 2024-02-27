import { InjectionToken } from '@angular/core';
import { SubMenuProps } from './types';

export const SUB_MENU_DATA = new InjectionToken<SubMenuProps>('SUB_MENU_DATA');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MENU_ITEM_DATA = new InjectionToken<any>('MENU_ITEM_DATA');
