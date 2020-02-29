import { IAxis } from './IAxis';
import { IDetail } from './IDetail';
import { ICell } from './ICell';
import { IApplicationUse } from './IApplicationUse';

/**
 * Prepares application data for rendering according to a selected set of axes. 
 * @param applications The application data to prepare.
 * @param x The x axis to use.
 * @param y The y axis to use.
 */
export function getTable(flattened: Array<IApplicationUse>, x: IAxis, y: IAxis): Array<Array<ICell>> {
	// TODO: refactor the creation of result into a single iteration of the data

	// build the resultant table, a 3D array af rows (y), columns (x), and 0..n apps, including the x and y axis as row 0 and column 0 respectively
	const xAxis: Array<Array<ICell>> = [[makeCell({ id: "", name: "" }, "xAxis")], ...x.values.map(xValue => [makeCell({ id: "", name: xValue }, "xAxis")])];
	const interim = [xAxis, ...y.values.map(yValue => [[makeCell({ id: "", name: yValue }, "yAxis")], ...x.values.map(xValue => flattened.filter(app => app.xValue === xValue && app.yValue === yValue).map(app => makeCell(app.detail, app.status)))])];

	// create blank apps and split rows as necessary
	// TODO: can we add this to the creation of interim above?
	for (let iY = interim.length; iY--;) {
		// where there are no apps in a cells insert an empty cell object
		interim[iY] = interim[iY].map(cell => cell.length === 0 ? [makeCell({ id: "", name: "" }, "empty")] : cell);

		// where there are multiple apps in a cell, expand the rows
		const counts = interim[iY].map(cell => cell.length || 1);
		const split = counts.reduce(leastCommonMultiple, 1);

		if (split > 1) {
			interim.splice(iY, 1, ...range(split).map(y => counts.map((c, x) => interim[iY][x].length === 0 ? [] : [cloneCell(interim[iY][x][Math.floor(y / split * c)], split)])));
		}
	}

	// create the final result structure
	const result = interim.map(row => row.map(col => col[0]));

	// merge adjacent cells
	const mY = result.length, mX = result[0].length;
	let app, adjacent: ICell;

	// iterate through the cells, from the bottom right to top left
	for (let iY = mY; iY--;) {
		for (let iX = mX; iX--;) {
			app = result[iY][iX];

			// try merge with cell above first
			if (iY && (adjacent = result[iY - 1][iX]) &&
				(adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.cols === app.cols)) {
				adjacent.rows += app.rows;
				adjacent.height += app.height;
				result[iY].splice(iX, 1);
			}

			// otherwise try cell to left
			else if (iX && (adjacent = result[iY][iX - 1]) &&
				(adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.rows === app.rows)) {
				adjacent.cols += app.cols;
				result[iY].splice(iX, 1);
			}
		}
	}

	return result;
}

/**
 * Creates a cell for the output table
 * @hidden
 */
function makeCell(detail: IDetail, style: string, colspan: number = 1, rowspan: number = 1, split: number = 1): ICell {
	return { detail, style, cols: colspan, rows: rowspan, height: 1 / split };
}

/**
 * Clones a cell for the output table
 * @hidden
 */
function cloneCell(cell: ICell, split: number): ICell {
	return makeCell(cell.detail, cell.style, cell.cols, cell.rows, split);
}
/**
 * Returns an array of numbers from 0 to n -1
 * @param n 
 * @hidden
 */
function range(n: number): Array<number> {
	const result: Array<number> = [];

	for (let i = 0; i < n; ++i) {
		result.push(i);
	}

	return result;
}

/**
 * Returns the least common multiple of two integers
 * @param a 
 * @param b
 * @hidden 
 */
function leastCommonMultiple(a: number, b: number): number {
	return (a * b) / greatestCommonFactor(a, b);
}

/**
 * Returns the greatest common factor of two numbers
 * @param a 
 * @param b 
 * @hidden
 */
function greatestCommonFactor(a: number, b: number): number {
	return b ? greatestCommonFactor(b, a % b) : a;
}
