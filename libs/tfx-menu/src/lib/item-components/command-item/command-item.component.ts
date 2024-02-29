import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MENU_ITEM_DATA } from '../../tokens';
import { CommandItemProps } from '../../types';

@Component({
  selector: 'tfx-command-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './command-item.component.html',
  styleUrl: './command-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandItemComponent {
  menuItem: CommandItemProps = inject(MENU_ITEM_DATA);
}
