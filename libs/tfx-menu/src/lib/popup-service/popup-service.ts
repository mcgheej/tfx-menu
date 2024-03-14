import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  ElementRef,
  Injectable,
  Injector,
  inject,
} from '@angular/core';
import { SubMenuComponent } from '../menu-components/sub-menu/sub-menu.component';
import { MenuParent } from '../types/menu-parent.type';
import { PopupComponentOptions } from '../types/popup-component-options.type';
import { SubMenuData } from '../types/token.types';
import { SUB_MENU_DATA } from '../types/tokens';
import { ExecutableItemProps, SubMenuProps } from '../types/types';
import { PopupRef } from './popup-ref';

export const DEFAULT_CONFIG: PopupComponentOptions = {
  hasBackdrop: true,
  backdropClass: 'transparent-backdrop',
  panelClass: 'tfx-menu-panel',
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
    menuParent: MenuParent,
    config: PopupComponentOptions
  ): PopupRef<ExecutableItemProps> {
    const menuConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(menuConfig);
    const menuRef = new PopupRef<ExecutableItemProps>(overlayRef);
    this.attachSubMenuContainer(overlayRef, subMenu, menuParent, menuRef);

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
    menuParent: MenuParent,
    popupRef: PopupRef<ExecutableItemProps>
  ): SubMenuComponent {
    const injector = this.createInjector(subMenu, menuParent, popupRef);
    const containerPortal = new ComponentPortal(
      SubMenuComponent,
      null,
      injector
    );
    const containerRef: ComponentRef<SubMenuComponent> =
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
    menuParent: MenuParent,
    menuRef: PopupRef<ExecutableItemProps>
  ): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: PopupRef, useValue: menuRef },
        {
          provide: SUB_MENU_DATA,
          useValue: {
            subMenu,
            menuParent,
          } as SubMenuData,
        },
      ],
    });
  }
}
