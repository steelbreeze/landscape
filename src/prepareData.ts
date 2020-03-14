import { IApplication, IUsage, IUseDetail } from './IApplication';
import { IAxes } from './IAxes';

/**
 * Structures and denormalises the application data aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param axes The chosen x and y axis.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
export function prepareData(applications: Array<IApplication & IUsage>, axes: IAxes): Array<Array<Array<IApplication & IUseDetail>>> {
	// create the empty destination table structure
	const result: Array<Array<Array<IApplication & IUseDetail>>> = axes.y.values.map(() => axes.x.values.map(() => []));

	// denormalise and position each application within the correct table cell
	for (const app of applications) {
		for (const use of app.usage) {
			const yIndex = axes.y.values.indexOf(use.dimensions[axes.y.name]), xIndex = axes.x.values.indexOf(use.dimensions[axes.x.name]);

			if (yIndex >= 0 && xIndex >= 0) {
				result[yIndex][xIndex].push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
			}
		}
	}

	// TODO: consider the order of applications within a cell to promote merges in getTable

	return result;
}
