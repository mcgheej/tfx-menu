import { ConnectedPosition } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';

export interface PopupComponentOptions {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  associatedElement?: ElementRef;
  positions?: ConnectedPosition[];
  backdropClick?: () => void;
}
