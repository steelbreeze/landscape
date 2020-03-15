import { IApplication, IUsage } from './IApplication';
import { IAxis } from './IAxis';
import { IAxes } from './IAxes';

/**
 * A generator function that takes an axis and generates the scenarios used in the selection of the optimal axis order.
 */
export type ScenarioGenerator = (axis: IAxis) => Array<Array<string>>;

type Denormalised = Array<IApplication & { status: string; usage: Array<{ x: string; y: string }> }>;

/**
 * Determine the optimum order of the x and y axes resulting in a layout with applications grouped together.
 * @param applications The raw application data
 * @param axes The x and y axes
 * @param axesSelector A function 
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
export function getOptimalAxes(applications: Array<IApplication & IUsage>, axes: IAxes, axesSelector: (scenarios: Array<IAxes>) => IAxes = scenarios => scenarios[0], xF: ScenarioGenerator = flexOrder, yF: ScenarioGenerator = flexOrder): IAxes {
	const denormalised = denormalise(applications, axes.x, axes.y);

	// retain only the scenarios with the best adjacency
	let scenarios: Array<IAxes> = [];
	let bestAdjacency = -1;

	// iterate all X and Y using the formulas provided
	for (const yValues of yF(axes.y)) for (const xValues of xF(axes.x)) {
		const adjacency = countAdjacency(denormalised, xValues, yValues, true, true);

		// just keep the best scenarios
		if (adjacency >= bestAdjacency) {
			// reset the best if needed
			if (adjacency > bestAdjacency) {
				scenarios = [];
				bestAdjacency = adjacency;
			}

			scenarios.push({ x: { name: axes.x.name, values: xValues }, y: { name: axes.y.name, values: yValues } });
		}
	}

	return axesSelector(scenarios);
}

/**
 * Determine the a good order of the axes resulting in a layout with applications grouped together.
 * @param applications The raw application data
 * @param axes The x and y axes
 * @param axesSelector A function 
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
export function getGoodAxes(applications: Array<IApplication & IUsage>, axes: IAxes, axesSelector: (scenarios: Array<IAxes>) => IAxes = scenarios => scenarios[0], xF: ScenarioGenerator = flexOrder, yF: ScenarioGenerator = flexOrder): IAxes {
	// determine the long and short axes; currently use y for the long axis, x for the short
	const isXLong = axes.x.values.length > axes.y.values.length;
	const shortAxis = isXLong ? axes.y : axes.x;
	const longAxis = isXLong ? axes.x : axes.y;
	const denormalised = denormalise(applications, shortAxis, longAxis);

	// retain only the scenarios with the best adjacency
	let lScenarios: Array<Array<string>> = [];
	let scenarios: Array<IAxes> = [];
	let bestAdjacency = -1;

	// iterate the long axis using the provided short axis
	for (const lValues of (isXLong ? xF : yF)(longAxis)) {
		const adjacency = countAdjacency(denormalised, shortAxis.values, lValues, false, true);

		// just keep the best scenarios
		if (adjacency >= bestAdjacency) {
			// reset the best if needed
			if (adjacency > bestAdjacency) {
				lScenarios = [];
				bestAdjacency = adjacency;
			}

			lScenarios.push(lValues);
		}
	}

	// reset the best adjacency
	bestAdjacency = -1;

	// iterate all X and just the best Y using the formulas provided
	for (const lValues of lScenarios) for (const sValues of (isXLong ? yF : xF)(shortAxis)) {
		const adjacency = countAdjacency(denormalised, sValues, lValues, true, false);

		// just keep the best scenarios
		if (adjacency >= bestAdjacency) {
			// reset the best if needed
			if (adjacency > bestAdjacency) {
				scenarios = [];
				bestAdjacency = adjacency;
			}

			scenarios.push(isXLong ? { y: { name: shortAxis.name, values: sValues }, x: { name: longAxis.name, values: lValues } } : { x: { name: shortAxis.name, values: sValues }, y: { name: longAxis.name, values: lValues } });
		}
	}


	return axesSelector(scenarios);
}

function denormalise(applications: Array<IApplication & IUsage>, x: IAxis, y: IAxis): Denormalised {
	const interim: Denormalised = [];

	for (const app of applications) {
		for (const use of app.usage) {
			let interimApp = interim.filter(a => a.detail.id === app.detail.id && a.status === use.status)[0];

			if (!interimApp) {
				interimApp = { detail: app.detail, status: use.status, usage: [] };

				interim.push(interimApp);
			}

			interimApp.usage.push({ x: use.dimensions[x.name], y: use.dimensions[y.name] });
		}
	}

	// delete single use app/status combinations as they cannot contribute to affinity score
	return interim.filter(app => app.usage.length > 1);
}

function countAdjacency(denormalised: Denormalised, xValues: Array<string>, yValues: Array<string>, countX: boolean, countY: boolean): number {
	let adjacency = 0;

	// test each application/status combination individually
	for (const app of denormalised) {
		// create 2d boolean matrix where the application exists 
		const matrix = yValues.map(yValue => xValues.map(xValue => app.usage.some(use => use.y === yValue && use.x === xValue)));

		// count adjacent cells
		for (let iY = yValues.length; iY--;) for (let iX = xValues.length; iX--;) {
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

	return adjacency;
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
	let result: Array<Array<T>> = [];

	if (source.length === 1) {
		result = [source];
	} else {
		source.forEach(exclude => {
			for (const excluded of permutations(source.filter(element => element !== exclude))) { // NOTE: we know we have unique values, so can compare the strings
				result.push([exclude, ...excluded]);
			}
		});
	}

	return result;
}
