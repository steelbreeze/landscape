import { Dimension } from "./Dimension";

/** Represents a pair of axis. */
export interface Axes {
    /** The dimension used for the x axis */
    xDimension: Dimension;

    /** The values of the x axis */
    xValues: Array<string>;

    /** The dimension used for the y axis */
    yDimension: Dimension;

    /** The values of the y axis */
    yValues: Array<string>;
}
