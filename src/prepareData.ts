import { IApplication, IUsage, IUseDetail } from './IApplication';
import { IAxis } from './IAxis';

/**
 * Structures and denormalises the application data aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
export function prepareData(applications: Array<IApplication & IUsage>, x: IAxis, y: IAxis): Array<Array<Array<IApplication & IUseDetail>>> {
	// create the empty destination table structure
	const result: Array<Array<Array<IApplication & IUseDetail>>> = y.values.map(() => x.values.map(() => []));

	// denormalise and position each application within the correct table cell
	for (const app of applications) {
		for (const use of app.usage) {
			const yIndex = y.values.indexOf(use.dimensions[y.name]), xIndex = x.values.indexOf(use.dimensions[x.name]);

			if (yIndex >= 0 && xIndex >= 0) {
				result[yIndex][xIndex].push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
			}
		}
	}

	// TODO: consider the order of applications within a cell to promote merges in getTable

	return result;
}
