import { Injectable, QueryList, inject } from '@angular/core';
import { TopLevelItemComponent } from '../item-components/top-level-item/top-level-item.component';
import { PopupRef } from '../popup-service/popup-ref';
import { PopupService } from '../popup-service/popup-service';
import { SubMenuChildItemProps, TopLevelItemProps } from '../types';

@Injectable()
export class AppMenuSubMenuService {
  private popup = inject(PopupService);

  private menuRef: PopupRef<SubMenuChildItemProps> | null = null;

  private itemComponents: { [id: string]: TopLevelItemComponent } = {};
  private expandedItem: TopLevelItemProps | null = null;

  setItemComponents(components: QueryList<TopLevelItemComponent>) {
    this.itemComponents = {};
    components.map((cmp) => (this.itemComponents[cmp.item.id] = cmp));
  }

  checkExpandedItem(item: TopLevelItemProps | null) {
    if (item) {
      if (this.expandedItem) {
        if (item.id !== this.expandedItem.id) {
          // Need to close currently open sub-menu and open new sub-menu
          // for newly expanded item
          this.closeSubMenu(this.expandedItem);
          this.openSubMenu(item);
          this.expandedItem = item;
        }
      } else {
        // need to open sub-menu for item - no sub-menu open at the moment
        this.openSubMenu(item);
        this.expandedItem = item;
      }
    } else {
      // Close any sub-menu currently open
      if (this.expandedItem) {
        this.closeSubMenu(this.expandedItem);
        this.expandedItem = null;
      }
    }
  }

  private closeSubMenu(item: TopLevelItemProps) {
    if (this.menuRef) {
      console.log(`close ${item.label} sub-menu`);
      this.menuRef.close();
      this.menuRef = null;
    }
  }

  private openSubMenu(item: TopLevelItemProps) {
    if (this.menuRef) {
      this.closeSubMenu(item);
    }
    if (this.itemComponents[item.id]) {
      console.log(`open ${item.label} sub-menu`);
      this.menuRef = this.popup.openSubMenu(item.subMenu, {
        associatedElement: this.itemComponents[item.id].elementRef,
        positions: [
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ],
        backdropClick: () => {
          this.closeSubMenu(item);
        },
      });
    }
  }
}
