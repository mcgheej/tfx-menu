import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MenuOptionsProps, TopLevelItemProps } from '../../types';
import { TopLevelItemVmService } from './top-level-item-vm.service';

@Component({
  selector: 'tfx-top-level-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-level-item.component.html',
  styleUrl: './top-level-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TopLevelItemVmService],
})
export class TopLevelItemComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) item!: TopLevelItemProps;
  @Input({ required: true }) menuOptions!: MenuOptionsProps;
  @Input({ required: true }) activeItemId!: string;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();
  @Output() mouseClick = new EventEmitter<void>();

  elementRef = inject(ElementRef);
  private vm = inject(TopLevelItemVmService);

  vm$ = this.vm.vm$;

  ngOnChanges(changes: SimpleChanges): void {
    this.vm.onChanges(changes);
  }

  ngOnDestroy(): void {
    this.vm.clearDown();
  }

  onMouseEnter() {
    this.mouseEnter.emit();
  }

  onMouseLeave() {
    this.mouseLeave.emit();
  }

  onMouseClick() {
    this.mouseClick.emit();
  }
}
