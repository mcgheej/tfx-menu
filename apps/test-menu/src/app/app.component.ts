import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AppMenuComponent } from '@tfx-menu/tfx-menu';
import { longMenu } from './long-menu';
import { shortMenu } from './short-menu';

@Component({
  standalone: true,
  imports: [JsonPipe, AppMenuComponent],
  selector: 'tfx-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'test-menu';
  showShortMenu = true;
  shortMenu = shortMenu;
  longMenu = longMenu;

  appMenu = this.shortMenu;

  onClick() {
    this.showShortMenu = !this.showShortMenu;
    this.appMenu = this.showShortMenu ? this.shortMenu : this.longMenu;
  }
}
