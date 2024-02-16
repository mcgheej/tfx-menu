import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MenuOptionsProps, TopLevelItemProps } from '../../types';

@Component({
  selector: 'tfx-top-level-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-level-item.component.html',
  styleUrl: './top-level-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopLevelItemComponent {
  @Input({
    required: true,
  })
  item!: TopLevelItemProps;
  @Input({
    required: true,
  })
  menuOptions!: MenuOptionsProps;
}
