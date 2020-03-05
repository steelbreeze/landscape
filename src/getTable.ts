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
	const empty = Cell({ id: "", name: "" }, "empty");

	// create the x-axis heading
	let result: Array<Array<ICell>> = [[Cell({ id: "", name: "" }, "xAxis"), ...x.values.map(xValue => Cell({ id: "", name: xValue }, "xAxis"))]];

	// create the rows
	for (const yValue of y.values) {
		// get the applications for each cells in the row; default if none found
		const yApps = flattened.filter(app => app.yValue === yValue);
		const row = x.values.map(xValue => { const cells = yApps.filter(app => app.xValue === xValue).map(app => Cell(app.detail, app.status)); return cells.length ? cells : [empty]; });

		// TODO: keep row as just apps and convert when adding rows?

		// determine the number of rows each row need to be expanded to based on the application count per cell
		const cellCounts = row.map(cell => cell.length);
		const split = cellCounts.reduce(leastCommonMultiple, 1);

		// expand the rows as needed
		for (let y = 0; y < split; y++) {
			result.push([Cell({ id: "", name: yValue }, "yAxis"), ...row.map((cell, x) => { const app = cell[Math.floor(y / split * cellCounts[x])]; return Cell(app.detail, app.style, split);})]);
		}
	}

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
function Cell(detail: IDetail, style: string, split: number = 1): ICell {
	return { detail, style, cols: 1, rows: 1, height: 1 / split };
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
