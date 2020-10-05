import { IApplication, IUsage, IUseDetail, IDimensions, IDetail } from './IApplication';
import { IAxis } from './IAxis';

/**
 * Structures and denormalises the application data aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @param getKey A callback to create a unique key for the reduction of applications into the cells.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
export function prepareData(applications: Array<IApplication & IUsage>, x: IAxis, y: IAxis, getKey: (detail: IDetail, use: IDimensions & IUseDetail ) => string): Array<Array<Array<IApplication & IDimensions & IUseDetail>>> {	// create the empty destination table structure
	const result: Array<Array<Array<{ key: string } & IApplication & IDimensions & IUseDetail>>> = y.values.map(() => x.values.map(() => []));

	// denormalise and position each application within the correct table cell
	for (const app of applications) {
		for (const use of app.usage) {
			const key = getKey(app.detail, use);
			const yIndex = y.values.indexOf(use.dimensions[y.name]);
			const xIndex = x.values.indexOf(use.dimensions[x.name]);

			// only add the app / use combination if there is a cell if the key is not already there
			if (yIndex !== -1 && xIndex !== -1 && !result[yIndex][xIndex].some(da => da.key === key)) {
				result[yIndex][xIndex].push({ key, detail: app.detail, dimensions: use.dimensions, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
			}
			// TODO: merge usage rather than ignore it
		}
	}

	return result;
}
