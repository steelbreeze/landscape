import { Function, Pair } from '@steelbreeze/types';
import { Axes, Cube } from '@steelbreeze/pivot';

/** The final text and class name to use when rendering cells in a table. */
export interface Element extends Pair {
	/** The class name to use in the final table rendering. */
	style: string;

	/** Optional text to display in place of Pair.value (which is used to de-dup) */
	text?: string;
}

/** An extension of Element, adding the number of rows and columns the element will occupy in the final table rendering. */
export interface Cell extends Element {
	/** The number of rows to occupy. */
	rows: number;

	/** The number of columns to occupy. */
	cols: number;
}

/**
 * The formula used to calculate the number of cells to split a row or column into.
 * @hidden
 */
let mode: (...values: Array<number>) => number = Math.max;

export function setMode(value: (...values: Array<number>) => number): void {
	mode = value;
}

/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getElement A callback to generate an element containing the details used in table rendering,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param precise A flag to control the method that cells are split; set to true to yeild an even number of splits for rows/columns.
 */
export function table<TRow>(cube: Cube<TRow>, axes: Axes<TRow>, getElement: Function<TRow, Element>, onX: boolean): Array<Array<Cell>> {
	// convert the source data to cells and remove resulting duplicates; create the resultant table
	return expand(cube.map(row => row.map(table => table.length ? cells(table, getElement) : <Cell[]>[cell(element('empty'))])), axes, onX);
}

/**
 * Expands a cube of cells into a table, creating mutiple rows or columns where a cell in a cube has multiple values.
 * @hidden
 */
function expand<TRow>(cells: Cube<Cell>, axes: Axes<TRow>, onX: boolean): Array<Array<Cell>> {
	// calcuate the x and y splits required
	const xSplits = axes.x.map((_, iX) => onX ? split(cells, row => row[iX].length) : 1);
	const ySplits = cells.map(row => onX ? 1 : split(row, table => table.length));

	// iterate and expand the y axis based on the split data
	return reduce(cells, ySplits, (row, ySplit, ysi, iY) =>

		// iterate and expand the x axis based on the split data
		reduce(row, xSplits, (cell, xSplit, xsi) =>

			// generate the cube cells
			({ ...cell[Math.floor(cell.length * (ysi + xsi) / (xSplit * ySplit))] }),

			// generate the y axis row header cells
			axes.y[iY].map(criterion => cell(element(`axis y ${criterion.key}`, criterion.value)))),

		// generate the x axis column header rows
		axes.x[0].map((_, iC) =>

			// iterate and expand the x axis
			reduce(axes.x, xSplits, x =>

				// generate the x axis cells
				cell(element(`axis x ${x[iC].key}`, x[iC].value)),

				// generate the x/y header
				axes.y[0].map(() => cell(element('axis xy'))))
		));
}

/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export const merge = (cells: Array<Array<Cell>>, onX: boolean, onY: boolean): void => {
	let next;

	forEachRev(cells, (row, iY) => {
		forEachRev(row, (cell, iX) => {

			if (onY && iY && (next = cells[iY - 1][iX]) && equals(next, cell) && next.cols === cell.cols) {
				next.rows += cell.rows;
				row.splice(iX, 1);
			} else if (onX && iX && (next = row[iX - 1]) && equals(next, cell) && next.rows === cell.rows) {
				next.cols += cell.cols;
				row.splice(iX, 1);
			}
		});
	});
}

/**
 * Convert a table of rows into a table of cells.
 * @hidden
 */
function cells<TRow>(table: Array<TRow>, getElement: Function<TRow, Element>): Array<Cell> {
	const result: Array<Cell> = [];

	for (const row of table) {
		const element = getElement(row);

		if (!result.some(cell => equals(cell, element))) {
			result.push(cell(element));
		}
	}

	return result;
}

/**
 * Calculate the number of splits required for a given cell
 * @hidden 
 */
const split = <T>(source: Array<T>, callbackfn: Function<T, number>) => mode(...source.map(item => callbackfn(item) || 1))

/**
 * Expands an array using, splitting values into multiple based on a set of corresponding splits then maps the data to a desired structure.
 * @hidden 
 */
function reduce<TSource, TResult>(values: TSource[], splits: number[], callbackfn: (value: TSource, split: number, iSplit: number, iValue: number) => TResult, seed: TResult[]): TResult[] {
	values.forEach((value, iValue) => {
		const split = splits[iValue];

		for (let iSplit = 0; iSplit < split; ++iSplit) {
			seed.push(callbackfn(value, split, iSplit, iValue));
		}
	});

	return seed;
}

/**
 * A reverse for loop
 * @param hidden
 */
const forEachRev = <TValue>(values: Array<TValue>, callbackfn: (value: TValue, index: number) => void): void => {
	for (let index = values.length; index--;) {
		callbackfn(values[index], index);
	}
}

/**
 * Returns the least common multiple of a set of integers generated from an object. 
 * @hidden
 */
export const leastCommonMultiple = (...counts: Array<number>): number => counts.reduce((a, b) => (a * b) / greatestCommonFactor(a, b));

/**
 * Returns the greatest common factor of two numbers
 * @hidden
 */
const greatestCommonFactor = (a: number, b: number): number => b ? greatestCommonFactor(b, a % b) : a;

/**
 * Compare two Elements for equality
 * @hidden 
 */
const equals = (a: Element, b: Element): boolean => a.key === b.key && a.value === b.value && a.style === b.style;

/**
 * Creates a Element.
 * @hidden 
 */
const element = (style: string, value: string = '', key = ''): Element => ({ key, value, style });

/**
 * Creates a cell within a table.
 * @hidden 
 */
const cell = (key: Element): Cell => ({ ...key, rows: 1, cols: 1 });
