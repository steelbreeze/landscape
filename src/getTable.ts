import { Detail } from './Detail';
import { IApplication } from './IApplication';
import { IAxis } from './IAxis';
import { Cell } from './Cell';
import { IDetail } from './IDetail';
import { flatten } from './flatten';

/**
 * Prepares application data for rendering according to a selected set of axes. 
 * @param applications The application data to prepare.
 * @param axes The axes to use.
 */
export function getTable(applications: Array<IApplication>, x: IAxis, y: IAxis): Array<Array<Cell>> {
	// build the resultant table, a 3D array af rows (y), columns (x), and 0..n apps, including the x and y axis as row 0 and column 0 respectively
	const flattened: Array<{detail: IDetail, xValue: string, yValue: string, status: string }> = [];

	for(const app of applications) {
		for(const use of app.usage) {
			flattened.push({detail: app.detail, xValue: use.dimensions[x.name], yValue: use.dimensions[y.name], status: use.status});
		}
	}

	// build the resultant table, a 3D array af rows (y), columns (x), and 0..n apps, including the x and y axis as row 0 and column 0 respectively
	const xAxis = [[new Cell(new Detail(), "xAxis")], ...x.values.map(xValue => [new Cell(new Detail("", xValue), "xAxis")])];
	const interim = [xAxis, ...y.values.map(yValue => [[new Cell(new Detail("", yValue), "yAxis")], ...x.values.map(xValue => flattened.filter(app => app.xValue === xValue && app.yValue === yValue).map(app => new Cell(app.detail, app.status)))])];

	// create blank apps and split rows as necessary
	for (let iY = interim.length; iY--;) {
		// where there are no apps in a cells insert an empty cell object
		for (let iX = interim[iY].length; iX--;) {
			if (interim[iY][iX].length === 0) {
				interim[iY][iX].push(new Cell(new Detail(), "empty"));
			}
		}

		// where there are multiple apps in a cell, expand the rows
		const counts = interim[iY].map(cell => cell.length || 1);
		const split = counts.reduce((a, b) => leastCommonMultiple(a, b), 1);

		if (split > 1) {
			interim.splice(iY, 1, ...range(split).map(y => counts.map((c, x) => interim[iY][x].length === 0 ? [] : [interim[iY][x][Math.floor(y / split * c)].clone(split)])));
		}
	}

	// create the final result structure
	const result = interim.map(row => row.map(col => col[0]));

	// merge adjacent cells
	const mY = result.length, mX = result[0].length;
	for (let iY = mY; iY--;) {
		for (let iX = mX; iX--;) {
			const app = result[iY][iX];
			let merged = false;

			// try merge with cell above first
			if (!merged && iY) {
				const above = result[iY - 1][iX];

				if (above.detail.name === app.detail.name && above.style === app.style && above.colspan === app.colspan) {
					above.rowspan += app.rowspan;
					above.height += app.height;
					result[iY].splice(iX, 1);
					merged = true;
				}
			}

			// otherwise try cell to left
			if (!merged && iX) {
				const left = result[iY][iX - 1];

				if (left.detail.name === app.detail.name && left.style === app.style && left.rowspan === app.rowspan) {
					left.colspan += app.colspan;
					result[iY].splice(iX, 1);
					merged = true;
				}
			}
		}
	}

	return result;
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
