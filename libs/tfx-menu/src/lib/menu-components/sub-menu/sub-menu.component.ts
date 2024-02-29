import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tfx-sub-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-menu.component.html',
  styleUrl: './sub-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubMenuComponent {}
