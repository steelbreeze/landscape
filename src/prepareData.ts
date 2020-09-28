import { IApplication, IUsage, IUseDetail, IDimensions} from './IApplication';
import { IAxes } from './IAxes';

/**
 * Structures and denormalises the application data aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param axes The chosen x and y axis.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
export function prepareData(applications: Array<IApplication & IUsage>, axes: IAxes, key: string = "id"): Array<Array<Array<IApplication & IDimensions & IUseDetail>>> {
	// create the empty destination table structure
	const result: Array<Array<Array<IApplication & IDimensions & IUseDetail>>> = axes.y.values.map(() => axes.x.values.map(() => []));

	// denormalise and position each application within the correct table cell
	for (const app of applications) {
		for (const use of app.usage) {
			const yIndex = axes.y.values.indexOf(use.dimensions[axes.y.name]);
			const xIndex = axes.x.values.indexOf(use.dimensions[axes.x.name]);

			// only add the app / use combination if there is a cell in the target table and the app/status combination is unique within that cell
			if (yIndex !== -1 && xIndex !== -1 && !result[yIndex][xIndex].some(da => da.detail[key] === app.detail[key] && da.status === use.status)) {
				result[yIndex][xIndex].push({ detail: app.detail, dimensions: use.dimensions, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
			}
		}
	}

	return result;
}
