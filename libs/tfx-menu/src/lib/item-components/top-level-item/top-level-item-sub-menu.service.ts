import { Injectable, SimpleChanges } from '@angular/core';

@Injectable()
export class TopLevelItemSubMenuService {
  onChanges(changes: SimpleChanges) {
    if (changes['expandedItemId']) {
      // process new expandedItemId
    }
  }
}
