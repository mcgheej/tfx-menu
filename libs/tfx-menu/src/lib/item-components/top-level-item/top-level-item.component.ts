import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MenuOptionsProps, TopLevelItemProps } from '../../types';
import { TopLevelItemService } from './top-level-item.service';

@Component({
  selector: 'tfx-top-level-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-level-item.component.html',
  styleUrl: './top-level-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TopLevelItemService],
})
export class TopLevelItemComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) item!: TopLevelItemProps;
  @Input({ required: true }) menuOptions!: MenuOptionsProps;
  @Input({ required: true }) activeItemId!: string;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();
  @Output() mouseClick = new EventEmitter<void>();

  private service = inject(TopLevelItemService);

  vm$ = this.service.vm$;

  ngOnChanges(changes: SimpleChanges): void {
    this.service.onChanges(changes);
  }

  ngOnDestroy(): void {
    this.service.clearDown();
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
