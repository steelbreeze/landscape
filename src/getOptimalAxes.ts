import { IApplication, IUsage, Properties, IDimensions, IKey, IKeyed } from './IApplication';
import { IAxis } from './IAxis';
import { IAxes } from './IAxes';

/**
 * @hidden
 */
interface LongAndShort { 
	l: string;
	s: string;
}

/**
 * @hidden
 */
interface IDenormalised {
	key: IKey;
	usage: Array<LongAndShort>;
}

/**
 * Determine the a good order of the axes resulting in a layout with applications grouped together.
 * @param applications The raw application data
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @param getKey A callback to create a unique key for the reduction of applications into the cells.
 * @param axesSelector A function 
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
export function getOptimalAxes(applications: Array<IApplication & IUsage>, x: IAxis, y: IAxis, getKey: (detail: Properties, use: IDimensions & Properties ) => IKey, axesSelector: (scenarios: Array<IAxes>) => IAxes = scenarios => scenarios[0], xF: (axis: IAxis) => Array<Array<string>> = flexOrder, yF: (axis: IAxis) => Array<Array<string>> = flexOrder): IAxes {
	const isXLong = x.values.length > y.values.length;
	const shortAxis = isXLong ? y : x;
	const longAxis = isXLong ? x : y;
	let interimScenarios: Array<Array<string>> = [];
	let scenarios: Array<IAxes> = [];
	let bestAdjacency = -1;

	// denormalise the data
	const denormalised = applications.reduce<Array<IApplication & IDenormalised>>((result, app) => {
		const interim: Array<IKeyed & IApplication & IDenormalised> = [];

		for (const use of app.usage) {
			const key = getKey(app.detail, use);

			let denormalisedApp = interim.filter(a => a.key.style === key.style)[0];

			if (!denormalisedApp) {
				denormalisedApp = { detail: app.detail, key, usage: [] };

				interim.push(denormalisedApp);
			}

			denormalisedApp.usage.push({ s: use.dimensions[shortAxis.name], l: use.dimensions[longAxis.name] });
		}

		return result.concat(...interim.filter(app => app.usage.length > 1));
	}, []);

	// iterate permutations of the long axis, use the short axis as provided
	for (const longAxisValues of (isXLong ? xF : yF)(longAxis)) {
		// count only adjacency along the long axis
		let adjacency = 0;

		// test each combination individually
		for (const app of denormalised) {
			// create 2d boolean matrix where the application exists 
			const matrix = longAxisValues.map(l => shortAxis.values.map(s => app.usage.some(use => use.l === l && use.s === s)));

			for (let iL = longAxisValues.length; --iL;) for (let iS = shortAxis.values.length; iS--;) {
				if (matrix[iL][iS] && matrix[iL - 1][iS]) {
					adjacency++;
				}
			}
		}

		// just keep the best scenarios
		if (adjacency >= bestAdjacency) {
			// reset the best if needed
			if (adjacency > bestAdjacency) {
				interimScenarios = [];
				bestAdjacency = adjacency;
			}

			interimScenarios.push(longAxisValues);
		}
	}

	// reset the best adjacency
	bestAdjacency = -1;

	// iterate just the best long axis results and iterate permutations of the short axis
	for (const longAxisValues of interimScenarios) for (const shortAxisValues of (isXLong ? yF : xF)(shortAxis)) {
		// count only adjacency alony the short axis
		let adjacency = 0;

		// test each application/status combination individually
		for (const app of denormalised) {
			// create 2d boolean matrix where the application exists 
			const matrix = longAxisValues.map(l => shortAxisValues.map(s => app.usage.some(use => use.l === l && use.s === s)));

			// count adjacent cells on the x axis
			for (let iL = longAxisValues.length; iL--;) for (let iS = shortAxisValues.length; --iS;) {
				if (matrix[iL][iS] && matrix[iL][iS - 1]) {
					adjacency++;
				}
			}
		}

		// just keep the best scenarios
		if (adjacency >= bestAdjacency) {
			// reset the best if needed
			if (adjacency > bestAdjacency) {
				scenarios = [];
				bestAdjacency = adjacency;
			}

			scenarios.push(isXLong ? { y: { name: shortAxis.name, values: shortAxisValues }, x: { name: longAxis.name, values: longAxisValues } } : { x: { name: shortAxis.name, values: shortAxisValues }, y: { name: longAxis.name, values: longAxisValues } });
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
