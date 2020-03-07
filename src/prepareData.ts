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

