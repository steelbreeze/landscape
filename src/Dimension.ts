import { IDimensions } from './IDimensions';

/** An enumeration of the valid dimension names; dynamically generated from the [[IDimensions]] interface. */
export type Dimension = keyof IDimensions;
