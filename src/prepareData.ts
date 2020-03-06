import { IApplication } from './IApplication';
import { IApplicationUse } from './IApplicationUse';
import { IAxis } from './IAxis';
/**
 * Denormalises the application data for a given x and y axis.
 * @param applications The application data to prepare.
 * @param x The x axis dimension to use.
 * @param y The y axis dimension to use.
 */
export function prepareData(applications: Array<IApplication>, x: IAxis, y: IAxis): Array<Array<Array<IApplicationUse>>> {
	// TODO: refactor into a single iteration of x/y
	const denormalised: Array<IApplicationUse> = [];

	for (const app of applications) {
		for (const use of app.usage) {
			denormalised.push({ detail: app.detail, xValue: use.dimensions[x.name], yValue: use.dimensions[y.name], commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
		}
	}

	// create a 2D table of y and x axis containing an array of all applications within each cell
	return y.values.map(yValue => x.values.map(xValue => denormalised.filter(app => app.yValue === yValue).filter(app => app.xValue === xValue)));
}
