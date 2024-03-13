import { PartPartial } from './part-partial.type';
import { PopupComponentOptions } from './popup-component-options.type';

export type ContextPopupConfig = PartPartial<
  Omit<PopupComponentOptions, 'backdropClick'>,
  'associatedElement'
>;
