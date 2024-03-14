import { ExecutableItemProps } from './types';

export interface MenuParent {
  onEnterChildSubMenu: () => void;
  onExecuteCommand: (item: ExecutableItemProps) => void;
}
