import { PartPartial } from '../../part-partial.type';
import { CommandItemProps } from '../props-files/command-item-props.interface';

export type CommandItemConfig = PartPartial<CommandItemProps, 'type'>;
