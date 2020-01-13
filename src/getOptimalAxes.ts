import { Application } from './Application';
import { Axis } from './Axis';
import { Axes } from './Axes';
import { flatten } from './flatten';
import { permutations } from './permutations';
import { getAdjacency } from './getAdjacency';

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
export function getOptimalAxes(applications: Array<Application>, x: Axis, y: Axis, axesSelector: (scenarios: Array<Axes>) => Axes = scenarios => scenarios[0], xF: (axis: Axis) => Array<Array<string>> = flexOrder, yF: (axis: Axis) => Array<Array<string>> = flexOrder): Axes {
	// denormalise the underlying application data and resolve the axes
	const denormalised = flatten(applications, x, y);

	// some items not to recalculate in an O(n!) algo
	const xPerms = xF(x);
	const yPerms = yF(y);

	// retain only the scenarios with the best adjacency
	let scenarios: Array<Axes> = [];
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
 */
export function flexOrder(axis: Axis): Array<Array<string>> {
	return permutations(axis.values);
}
