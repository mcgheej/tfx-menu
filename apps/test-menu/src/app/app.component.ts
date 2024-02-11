import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AppMenuComponent, AppMenuConfig } from '@tfx-menu/tfx-menu';

@Component({
  standalone: true,
  imports: [JsonPipe, AppMenuComponent],
  selector: 'tfx-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'test-menu';

  appMenu: AppMenuConfig = {
    topLevelItems: [
      {
        label: 'File',
      },
      {
        label: 'Edit',
      },
      {
        label: 'Help',
      },
    ],
  };
}
