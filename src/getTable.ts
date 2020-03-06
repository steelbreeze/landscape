import { IAxis } from './IAxis';
import { IDetail } from './IDetail';
import { ICell } from './ICell';
import { IApplicationUse } from './IApplicationUse';

/**
 * Prepares application data for rendering according to a selected set of axes. 
 * @param flattened The flattened application data having previously been prepared by a call to [prepareData].
 * @param x The x axis to use.
 * @param y The y axis to use.
 */
export function getTable(flattened: Array<Array<Array<IApplicationUse>>>, x: IAxis, y: IAxis): Array<Array<ICell>> {
	// create the x-axis heading
	const result = [[cell(heading(), "xAxis"), ...x.values.map(xValue => cell(heading(xValue), "xAxis"))]];

	// create the rows in the result table
	flattened.forEach((row, i) => {
		// determine the number of rows each y axis value need to be expanded to
		const count: Array<number> = row.map(cell => cell.length || 1);
		const split: number = count.reduce(leastCommonMultiple, 1);

		// add the rows to the resultant table
		for (let si = 0; si < split; si++) {
			// add the y-axis row heading and its applications
			result.push([cell(heading(y.values[i]), "yAxis"), ...row.map((apps, x) => {
				const app = apps[Math.floor(si * count[x] / split)];
				return app ? cell(app.detail, app.status, split) : cell(heading(), "empty", split);
			})]);
		}
	});

	// merge adjacent cells
	const mY = result.length, mX = result[0].length;
	let app, adjacent: ICell;

	// iterate through the cells, from the bottom right to top left
	for (let iY = mY; iY--;) {
		for (let iX = mX; iX--;) {
			app = result[iY][iX];

			// try merge with cell above first
			if (iY && (adjacent = result[iY - 1][iX]) && (adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.cols === app.cols)) {
				// update the cell above to drop down into this cells space
				adjacent.rows += app.rows;
				adjacent.height += app.height;

				// remove this cell
				result[iY].splice(iX, 1);
			}

			// otherwise try cell to left
			else if (iX && (adjacent = result[iY][iX - 1]) && (adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.rows === app.rows)) {
				// update the cell left to spread across into this cells space
				adjacent.cols += app.cols;

				// remove this cell
				result[iY].splice(iX, 1);
			}
		}
	}

	return result;
}

/**
 * Creates a blank IDeail structure for x and y axis headings
 * @hidden
 */
function heading(name: string = ""): IDetail {
	return { id: "", name };
}

/**
 * Creates a cell for the output table
 * @hidden
 */
function cell(detail: IDetail, style: string, split: number = 1): ICell {
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
