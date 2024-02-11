import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { nanoid } from 'nanoid';
import { AppMenuConfig, AppMenuProps, MenuOptionsProps } from '../types';

const APP_MENU_OPTIONS_DEFAULT: MenuOptionsProps = {
  itemTextColor: '#ffffff',
  disabledItemTextColor: '#aaaaaa',
  itemBackgroundColor: '#008000',
  itemHighlightColor: '#006000',
  itemGroupSeparatorColor: '#aaaaaa',
  fontSizePixels: 13,
  outlinedIcons: false,
};

@Component({
  selector: 'tfx-app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMenuComponent {
  @Input({
    required: true,
    transform: (menu: AppMenuConfig) => {
      const props: AppMenuProps = {
        id: nanoid(),
        options: menu.options
          ? { ...APP_MENU_OPTIONS_DEFAULT, ...menu.options }
          : { ...APP_MENU_OPTIONS_DEFAULT },
        topLevelItems: menu.topLevelItems ?? [],
        type: 'appMenu',
      } as AppMenuProps;
      console.log(props);
      return props;
    },
  })
  menu!: AppMenuProps;
}
