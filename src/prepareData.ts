import { IApplication } from './IApplication';
import { IAxis } from './IAxis';
import { ApplicationUse } from './ApplicationUse';
/**
 * Denormalises the application data for a given x and y axis.
 * @param applications The application data to prepare.
 * @param x The x axis to use.
 * @param y The y axis to use.
 */
export function prepareData(applications: Array<IApplication>, x: IAxis, y: IAxis): Array<ApplicationUse> {
	const denormalised: Array<ApplicationUse> = [];
	for (const app of applications) {
		for (const use of app.usage) {
			denormalised.push({ detail: app.detail, xValue: use.dimensions[x.name], yValue: use.dimensions[y.name], commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
		}
	}
	return denormalised;
}
