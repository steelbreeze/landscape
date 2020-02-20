import { Detail } from './Detail';
import { IApplication } from './IApplication';
import { IAxis } from './IAxis';
import { Cell } from './Cell';
import { IDetail } from './IDetail';

/**
 * Data structure of flattened application data once x and y axes have been selected.
 * It is a denormalised view of the application and its usage context.
 */
export interface PreparedData {
	/** The meta data associated with the application. */
	detail: IDetail;

	/** The value of the chosen x axis. */
	xValue: string;

	/** The value of the chosen y axis. */
	yValue: string;

	/**
	 * The date this this particular application usage was commissioned.
	 * This is an optional field; undefined means that the origional commissioning date is unknown and therfore the beginning of time.
	 */
	commissioned: Date | undefined;

	/**
	 * The date this this particular application usage was decommissioned.
	 * This is an optional field; undefined means that the decommissioning date is unknown and therfore this application usage will continue to the end of time.
	 */
	decommissioned: Date | undefined;

	/** The status of an application in this usage context. */
	status: string;
}

/**
 * Denormalises the application data for a given x and y axis.
 * @param applications The application data to prepare.
 * @param x The x axis to use.
 * @param y The y axis to use.
 */
export function prepareData(applications: Array<IApplication>, x: IAxis, y: IAxis): Array<PreparedData> {
	const denormalised: Array<PreparedData> = [];

	for(const app of applications) {
		for(const use of app.usage) {
			denormalised.push({detail: app.detail, xValue: use.dimensions[x.name], yValue: use.dimensions[y.name], commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status});
		}
	}

	return denormalised;
}

/**
 * Prepares application data for rendering according to a selected set of axes. 
 * @param applications The application data to prepare.
 * @param x The x axis to use.
 * @param y The y axis to use.
 */
export function getTable(flattened: Array<PreparedData>, x: IAxis, y: IAxis): Array<Array<Cell>> {
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
		const split = counts.reduce(leastCommonMultiple, 1);

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
