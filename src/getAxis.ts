import { IApplication } from './IApplication';
import { Axis } from './Axis';

/**
 * Returns the unique set of values within an application data set for a given dimension.
 * @param applications The applications data.
 * @param name The name of the dimension.
 * @returns Returns the axis with its values.
 */
export function getAxis(applications: Array<IApplication>, name: string): Axis {
	const axis = new Axis(name, []);
	
	for(const application of applications) {
		for(const use of application.usage) {
			const value = use.dimensions[name];

			if(axis.values.indexOf(value) === -1) {
				axis.values.push(value);
			}
		}
	}

	return axis;
}
