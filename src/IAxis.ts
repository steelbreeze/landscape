import { Dimension } from "./Dimension";

/** Represents a single axis. */
export interface IAxis {
	/** The name of the dimension used on the axis */
	name: Dimension;

	/** The set of values on the axis. */
	values: Array<string>
}
