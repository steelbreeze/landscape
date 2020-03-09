import { IAxis } from './IAxis';
import { IApplication } from './IApplication';

/**
 * Extracts the list of unique values for a dimension from underlying application data.
 * @param applications The underlying application data.
 * @param dimension The name of the dimension.
 * @returns Returns an [IAxis] structure for hte 
 */
export function deriveAxis(applications: Array<IApplication>, dimension: string): IAxis {
	const values: Array<string> = [];

	for (const application of applications) {
		for (const use of application.usage) {
			const value = use.dimensions[dimension];

			if (values.indexOf(value) === -1) {
				values.push(value);
			}
		}
	}

	return { name: dimension, values };
}
