import { IApplication } from './IApplication';
import { IApplicationInContext } from './IApplicationInContext';
import { IAxis } from './IAxis';

/**
 * Structures and denormalises the application aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
export function prepareData(applications: Array<IApplication>, x: IAxis, y: IAxis): Array<Array<Array<IApplicationInContext>>> {
	// create the destination table structure
	const result: Array<Array<Array<IApplicationInContext>>> = y.values.map(() => x.values.map(()=>[]));

	// position each application within the correct table cell
	for(const app of applications) {
		for(const use of app.usage) {
			result[y.values.indexOf(use.dimensions[y.name])][x.values.indexOf(use.dimensions[x.name])].push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
		}
	}

	return result;
}
