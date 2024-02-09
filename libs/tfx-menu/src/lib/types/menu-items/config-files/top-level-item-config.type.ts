import { PartPartial } from '../../part-partial.type';
import { TopLevelItemProps } from '../props-files/top-level-item-props.interface';

export type TopLevelItemConfig = PartPartial<TopLevelItemProps, 'type'>;
