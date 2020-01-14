import { IApplication } from './IApplication';
import { IAxis } from './IAxis';
import { IAxes } from './IAxes';
import { flatten } from './flatten';
import { getAdjacency } from './getAdjacency';

/**
 * Returns all pairs of numbers from 0 to n -1
 * @param value 
 * @hidden
 */
function pairs(value: number): Array<Array<number>> {
	const result: Array<Array<number>> = [];

	for (let i = value; --i;) {
		for (let j = i; j--;) {
			result.push([i, j]);
		}
	}

	return result;
}

/**
 * Tom's algorithm as an alternative to getOptimalAxes
 * @param applications 
 * @param x 
 * @param y 
 * @hidden
 */
export function tom(applications: Array<IApplication>, x: IAxis, y: IAxis): Array<IAxes> {
	const isXAxisLonger = x.values.length >= y.values.length;
	const longAxis = isXAxisLonger ? x.values : y.values;
	const shortAxis = isXAxisLonger ? y.values : x.values;

	// flatten the application data
	const denormalised = flatten(applications, x, y);

	for (const pair of pairs(shortAxis.length)) {
		const adjacency = getAdjacency(denormalised,longAxis, [shortAxis[pair[0]], shortAxis[pair[1]]] );

		console.log(`${shortAxis[pair[0]]} / ${shortAxis[pair[1]]} = ${adjacency}`);

	}

	return [{ x, y }];
}