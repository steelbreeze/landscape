import { IApplication } from './IApplication';
import { Axis } from './Axis';
import { selectMany } from './selectMany';
import { unique } from './unique';

/**
 * Returns the unique set of values within an application data set for a given dimension.
 * @param applications The applications data.
 * @param name The name of the dimension.
 * @returns Returns the axis with its values.
 */
export function getAxis(applications: Array<IApplication>, name: string): Axis {
	return new Axis(name, selectMany(applications, app => app.usage, use => use.dimensions[name]).filter(unique));
}
