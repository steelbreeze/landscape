import { FlatApp } from "./flatten";

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
export function getAdjacency(denormalised: Array<FlatApp>, xAxis: Array<string>, yAxis: Array<string>, countX: boolean = true, countY: boolean = true): number {
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