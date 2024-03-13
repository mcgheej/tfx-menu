import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  Input,
  inject,
} from '@angular/core';
import { SubMenuChildItemProps } from '../../types/types';

@Component({
  selector: 'tfx-item-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngComponentOutlet="componentType; injector: injector">
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemContainerComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input({ required: true }) componentType!: any;
  @Input({ required: true }) item!: SubMenuChildItemProps;
  @Input({ required: true }) injector!: Injector;

  elementRef = inject(ElementRef);
}
