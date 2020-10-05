import { IApplication, IUsage, IUseDetail, IDimensions} from './IApplication';
import { IAxis } from './IAxis';

/**
 * Structures and denormalises the application data aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @param key The key to use for uniqueness checking
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
export function prepareData(applications: Array<IApplication & IUsage>, x: IAxis, y: IAxis, key: string = "name"): Array<Array<Array<IApplication & IDimensions & IUseDetail>>> {
	// create the empty destination table structure
	const result: Array<Array<Array<IApplication & IDimensions & IUseDetail>>> = y.values.map(() => x.values.map(() => []));

	// denormalise and position each application within the correct table cell
	for (const app of applications) {
		for (const use of app.usage) {
			const yIndex = y.values.indexOf(use.dimensions[y.name]);
			const xIndex = x.values.indexOf(use.dimensions[x.name]);

			// only add the app / use combination if there is a cell in the target table and the app/status combination is unique within that cell
			if (yIndex !== -1 && xIndex !== -1 && !result[yIndex][xIndex].some(da => da.detail[key] === app.detail[key] && da.status === use.status)) {
				result[yIndex][xIndex].push({ detail: app.detail, dimensions: use.dimensions, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
			}
		}
	}

	return result;
}
