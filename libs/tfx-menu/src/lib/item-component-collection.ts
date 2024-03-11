import { ItemContainerComponent } from './item-components/item-container/item-container.component';
import { TopLevelItemComponent } from './item-components/top-level-item/top-level-item.component';

export interface ItemComponentCollection {
  [id: string]: TopLevelItemComponent | ItemContainerComponent; // TODO - needs modification to support sub-menus
}
