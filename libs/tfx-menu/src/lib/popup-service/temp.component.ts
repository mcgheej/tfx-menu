import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SUB_MENU_DATA } from '../tokens';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `<p>temp works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TempComponent {
  subMenu = inject(SUB_MENU_DATA);
}
