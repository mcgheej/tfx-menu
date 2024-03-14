import { AppMenuComponent } from '../menu-components/app-menu/app-menu.component';
import { ContextMenuService } from '../menu-components/context-menu/context-menu.service';
import { SubMenuComponent } from '../menu-components/sub-menu/sub-menu.component';

export type MenuParent =
  | AppMenuComponent
  | SubMenuComponent
  | ContextMenuService;
