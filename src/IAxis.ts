// @steelbreeze/landscape
// Copyright (c) 2019 David Mesquita-Morris

/** Represents a single axis. */
export interface IAxis {
	/** The name of the dimension used on the axis */
	name: string;

	/** The set of values on the axis. */
	values: Array<unknown>
}
