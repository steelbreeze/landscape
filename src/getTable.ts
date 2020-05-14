import { IApplication, IDetail, IUseDetail } from './IApplication';
import { ILayout } from './ILayout';
import { IAxes } from './IAxes';

/**
 * Prepares application data for rendering according to a selected set of axes. 
 * @param applications The structured application data having previously been prepared by a call to [prepareData].
 * @param axes The x and y axis.
 */
export function getTable(applications: Array<Array<Array<IApplication & IUseDetail>>>, axes: IAxes): Array<Array<IApplication & ILayout>> {
	// create the x-axis heading
	const result = [[cell({ id: "", name: "" }, "xAxis"), ...axes.x.values.map(xValue => cell({ id: "", name: xValue }, "xAxis"))]];

	// create the rows in the result table
	applications.forEach((row, rowIndex) => {
		// determine the number of rows each y axis value need to be expanded to
		const appsPerCell = row.map(apps => apps.length || 1);
		const rowSplit = appsPerCell.reduce(leastCommonMultiple, 1);

		// add the rows to the resultant table
		for (let rowSplitIndex = rowSplit; rowSplitIndex--;) {
			// add the y-axis row heading and its applications
			result.push([cell({ id: "", name: axes.y.values[rowIndex] }, "yAxis"), ...row.map((apps, columnIndex) => {
				const app = apps[Math.floor(rowSplitIndex * appsPerCell[columnIndex] / rowSplit)];
				return app ? cell(app.detail, app.status, rowSplit) : cell({ id: "", name: "" }, "empty", rowSplit);
			})]);
		}
	});

	// merge adjacent cells
	let app, adjacent: IApplication & ILayout;

	// iterate through the cells, from the bottom right to top left
	for (let iY: number = result.length; iY--;) {
		for (let iX: number = result[iY].length; iX--;) {
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
 * Creates a cell for the output table
 * @hidden
 */
function cell(detail: IDetail, style: string, rowSplit: number = 1, colSplit: number = 1): IApplication & ILayout {
	return { detail, style, cols: 1, rows: 1, height: 1 / rowSplit, width: 1 / colSplit };
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
