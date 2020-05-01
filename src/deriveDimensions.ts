import { IUsage } from './IApplication';
import { IAxis } from './IAxis';

/**
 * Extracts all the dimensions seen within the the use of the applications as a set of axis objects. 
 * @param applications The application data to extract the dimensions of.
 * @returns an dictionary of [IAxis] structures, keyed by the dimension name.
 */
export function deriveDimensions(applications: Array<IUsage>): Record<string, IAxis> {
	const index: Record<string, IAxis> = {};

	for (const application of applications) {
		for (const use of application.usage) {
			for (const name of Object.getOwnPropertyNames(use.dimensions)) {
				const value = use.dimensions[name];
				const axis = index[name] || (index[name] = { name, values: [] });

				if (axis.values.indexOf(value) === -1) {
					axis.values.push(value)
				}
			}
		}
	}

	return index;
}