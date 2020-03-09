import { IApplication, IApplicationUsage } from './IApplication';
import { IAxis } from './IAxis';
import { IAxes } from './IAxes';


// TODO: replace FlatApp with IApplication types

/**
 * A denormalised representation of application data.
 * @hidden
 */
interface FlatApp extends IApplication {
	status: string;
	usage: Array<{ x: string, y: string }>
}

/**
 * Determine the optimum order of the axes resulting in a layout with applications grouped together
 * @param applications The raw application data
 * @param x The x axis
 * @param y The y axis
 * @param axesSelector A function 
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
export function getOptimalAxes(applications: Array<IApplication & IApplicationUsage>, x: IAxis, y: IAxis, axesSelector: (scenarios: Array<IAxes>) => IAxes = scenarios => scenarios[0], xF: (axis: IAxis) => Array<Array<string>> = flexOrder, yF: (axis: IAxis) => Array<Array<string>> = flexOrder): IAxes {
	// denormalise the underlying application data and resolve the axes
	const denormalised = flatten(applications, x.name, y.name);

	// some items not to recalculate in an O(n!) algo
	const xPerms = xF(x);
	const yPerms = yF(y);

	// retain only the scenarios with the best adjacency
	let scenarios: Array<IAxes> = [];
	let bestAdjacency = -1;

	// iterate all X and Y using the formulas provided
	for (const yValues of yPerms) {
		for (const xValues of xPerms) {
			const adjacency = getAdjacency(denormalised, xValues, yValues);

			// just keep the best scenarios
			if (adjacency >= bestAdjacency) {
				if (adjacency > bestAdjacency) {
					scenarios = [];
					bestAdjacency = adjacency;
				}

				scenarios.push({ x: { name: x.name, values: xValues }, y: { name: y.name, values: yValues } });
			}
		}
	}

	return axesSelector(scenarios);
}

/**
 * Allow an axis to be assessed in any order of the axis values.
 * @param axis The axis to flex
 * @hidden
 */
export function flexOrder(axis: IAxis): Array<Array<string>> {
	return permutations(axis.values);
}

/**
 * Returns all possible orderings of an array
 * @hidden
 */
function permutations<T>(source: Array<T>): Array<Array<T>> {
	const result: Array<Array<T>> = [];

	if (source.length === 1) {
		result.push(source);
	} else {
		source.forEach((exclude, excludeIndex) => {
			for (const excluded of permutations(source.filter((element, elementIndex) => elementIndex !== excludeIndex))) {
				result.push([exclude, ...excluded]);
			}
		});
	}

	return result;
}

/**
 * Denormalise the application data into an intermedia
 * @param applications 
 * @param x 
 * @param y 
 * @hidden
 */
function flatten(applications: Array<IApplication & IApplicationUsage>, x: string, y: string): Array<FlatApp> {
	// denormalise the underlying application data and resolve the axes
	let interim: Array<FlatApp> = [];

	for (const app of applications) {
		for (const use of app.usage) {
			let interimApp = interim.filter(a => a.detail.id === app.detail.id && a.status === use.status)[0];

			if (!interimApp) {
				interimApp = { detail: app.detail, status: use.status, usage: [] };

				interim.push(interimApp);
			}

			interimApp.usage.push({ x: use.dimensions[x], y: use.dimensions[y] });
		}
	}

	// delete single use app/status combinations as they cannot contribute to affinity score
	return interim.filter(app => app.usage.length > 1);
}


/**
 * Gets an adjacencey count for applications in a given scenario (sequence of axes values)
 * @param denormalised The denormalised application data
 * @param xAxis The xAxis
 * @param yAxis The yAxis
 * @param countX Count adjacency on the x axis
 * @param countY Count adjacency on the y axis
 * @returns Returns an adjacency count; the number of adjacent cells in the x and y dimensions
 * @hidden
 */
function getAdjacency(denormalised: Array<FlatApp>, xAxis: Array<string>, yAxis: Array<string>, countX: boolean = true, countY: boolean = true): number {
	let adjacency = 0;

	// test each application/status combination individually
	for (const app of denormalised) {
		// create 2d boolean matrix where the application exists 
		const matrix = yAxis.map(y => xAxis.map(x => app.usage.some(use => use.y === y && use.x === x)));

		// count adjacent cells
		for (let iY = yAxis.length; iY--;) {
			for (let iX = xAxis.length; iX--;) {
				if (matrix[iY][iX]) {
					if (countY && iY && matrix[iY - 1][iX]) {
						adjacency++;
					}

					if (countX && iX && matrix[iY][iX - 1]) {
						adjacency++;
					}
				}
			}
		}
	}

	return adjacency;
}