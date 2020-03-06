import { IApplication } from './IApplication';
import { IApplicationInContext } from './IApplicationInContext';
import { IAxis } from './IAxis';

/**
 * Denormalises the application data for a given x and y axis.
 * @param applications The application data to prepare.
 * @param x The x axis dimension to use.
 * @param y The y axis dimension to use.
 */
export function prepareData(applications: Array<IApplication>, x: IAxis, y: IAxis): Array<Array<Array<IApplicationInContext>>> {
	return y.values.map((yValue) => {
		const appsInRow = applications.filter(app => app.usage.some(use => use.dimensions[y.name] === yValue));

		return x.values.map((xValue) => {
			const appsInCell = appsInRow.filter(app => app.usage.some(use => use.dimensions[x.name] === xValue));
			const cell: Array<IApplicationInContext> = [];

			for (const app of appsInCell) {
				for (const use of app.usage) {
					if (use.dimensions[y.name] === yValue && use.dimensions[x.name] === xValue) {
						cell.push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
					}
				}
			}

			return cell;
		});
	});
}
