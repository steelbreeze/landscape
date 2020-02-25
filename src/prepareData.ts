import { IApplication } from './IApplication';
import { IAxis } from './IAxis';
import { IApplicationUse } from './IApplicationUse';
/**
 * Denormalises the application data for a given x and y axis.
 * @param applications The application data to prepare.
 * @param x The x axis to use.
 * @param y The y axis to use.
 */
export function prepareData(applications: Array<IApplication>, x: IAxis, y: IAxis): Array<IApplicationUse> {
	const denormalised: Array<IApplicationUse> = [];
	for (const app of applications) {
		for (const use of app.usage) {
			denormalised.push({ detail: app.detail, xValue: use.dimensions[x.name], yValue: use.dimensions[y.name], commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
		}
	}
	
	return denormalised;
}
