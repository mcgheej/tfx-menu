import { Signal } from '@angular/core';

/**
 * CommandItemProps
 * ================
 * This interface defines the properties for a command menu item.
 *
 *  id:       A unique identifier for the menu item
 *  label:    The label displayed for the menu item
 *  subLabel: A string showing the shortcut, if available,
 *            to execute the command
 *  disabled: Indicates whether or not the menu item is disabled
 *  visible:  Indicates whether or not the menu item is visible
 *  exec:     A function provided by the client application
 *            that is executed when the menu item is clicked.
 *  type:     Identifies the type of the menu item -
 *            always 'commandItem'
 */
export interface CommandItemProps {
  id: string;
  label: string;
  subLabel: string;
  disabled: Signal<boolean>;
  visible: Signal<boolean>;
  exec: () => void;
  type: 'commandItem';
}
