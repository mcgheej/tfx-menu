import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  ElementRef,
  Injectable,
  Injector,
  inject,
} from '@angular/core';
import { SUB_MENU_DATA } from '../tokens';
import { SubMenuChildItemProps, SubMenuProps } from '../types';
import { PopupRef } from './popup-ref';
import { TempComponent } from './temp.component';

export interface PopupComponentOptions {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  associatedElement?: ElementRef;
  positions?: ConnectedPosition[];
  backdropClick?: () => void;
}

export const DEFAULT_CONFIG: PopupComponentOptions = {
  hasBackdrop: true,
  backdropClass: 'transparent-backdrop',
  panelClass: 'tm-menu-panel',
  positions: [
    {
      originX: 'center',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'bottom',
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class PopupService {
  private injector = inject(Injector);
  private overlay = inject(Overlay);

  openSubMenu(
    subMenu: SubMenuProps,
    config: PopupComponentOptions
  ): PopupRef<SubMenuChildItemProps> {
    const menuConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(menuConfig);
    const menuRef = new PopupRef<SubMenuChildItemProps>(overlayRef);
    this.attachSubMenuContainer(overlayRef, subMenu, menuRef);

    overlayRef.backdropClick().subscribe(() => {
      if (menuConfig.backdropClick) {
        menuConfig.backdropClick();
      } else {
        menuRef.close();
      }
    });
    return menuRef;
  }

  private createOverlay(config: PopupComponentOptions): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachSubMenuContainer(
    overlayRef: OverlayRef,
    subMenu: SubMenuProps,
    popupRef: PopupRef<SubMenuChildItemProps>
  ): TempComponent {
    const injector = this.createInjector(subMenu, popupRef);
    const containerPortal = new ComponentPortal(TempComponent, null, injector);
    const containerRef: ComponentRef<TempComponent> =
      overlayRef.attach(containerPortal);
    return containerRef.instance;
  }

  private getOverlayConfig(config: PopupComponentOptions): OverlayConfig {
    config.associatedElement = config.associatedElement ?? ({} as ElementRef);
    config.positions = config.positions ?? [];
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(config.associatedElement)
      .withViewportMargin(30)
      .withPositions(config.positions);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }

  private createInjector(
    subMenu: SubMenuProps,
    menuRef: PopupRef<SubMenuChildItemProps>
  ): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: PopupRef, useValue: menuRef },
        { provide: SUB_MENU_DATA, useValue: subMenu },
      ],
    });
  }
}