import { Application } from './Application';
import { Axis } from './Axis';
import { Axes } from './Axes';
import { Detail } from './Detail';
import { permutations } from './permutations';

/**
 * Determine the optimum order of the axes resulting in a layout with applications grouped together
 * @param applications The raw application data
 * @param x The x axis
 * @param y The y axis
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
export function getOptimalAxes(applications: Array<Application>, x: Axis, y: Axis, yF: (axis: Array<string>) => Array<Array<string>> = permutations, xF: (axis: Array<string>) => Array<Array<string>> = permutations): Array<Axes> {
	let result: Array<Axes> = [];
	let bestAdjacency = -1;

	// denormalise the underlying application data and resolve the axes
	let interim: Array<{ detail: Detail, status: string, usage: Array<{ x: string, y: string }> }> = [];

	for (const app of applications) {
		for (const use of app.usage) {
			let interimApp = interim.filter(a => a.detail.id === app.detail.id && a.status === use.status)[0];

			if (!interimApp) {
				interimApp = { detail: app.detail, status: use.status, usage: [] };

				interim.push(interimApp);
			}

			interimApp.usage.push({ x: use[x.name], y: use[y.name] });
		}
	}

	// delete single use app/status combinations as they cannot contribute to affinity score
	interim = interim.filter(app => app.usage.length > 1);

	// some items not to recalculate in an O(n!) algo
	const xPerms = xF(x.values);

	// iterate all X and Y using the formulas provided
	for (const yValues of yF(y.values)) {
		for (const xValues of xPerms) {
			let adjacency = 0;

			// test each application/status combination individually
			for (const app of interim) {
				// create 2d boolean matrix where the application exists 
				const matrix = yValues.map(y => xValues.map(x => app.usage.some(use => use.y === y && use.x === x)));

				// count adjacent cells
				for (let iY = yValues.length; iY--;) {
					for (let iX = xValues.length; iX--;) {
						if (matrix[iY][iX]) {
							if (iY && matrix[iY - 1][iX]) {
								adjacency++;
							}

							if (iX && matrix[iY][iX - 1]) {
								adjacency++;
							}
						}
					}
				}
			}

			// just keep the best scenarios
			if (adjacency >= bestAdjacency) {
				if (adjacency > bestAdjacency) {
					result = [];
					bestAdjacency = adjacency;
				}

				result.push({ x: { name: x.name, values: xValues }, y: { name: y.name, values: yValues } });
			}
		}
	}

	return result;
}
