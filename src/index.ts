import { Axes, Cube, Func, Pair, Row, Table } from '@steelbreeze/pivot';

/** The final text and class name to use when rendering cells in a table. */
export interface Key {
	/** The text to use in the final table rendering. */
	text: string;

	/** The class name to use in the final table rendering. */
	style: string;
}

/** An extension of key, adding the number of rows and columns the key will occupy in the final table rendering. */
export interface Cell<TRow extends Row> extends Key {
	/** Unique keys for the source context. */
	index: Array<number>;

	/** The the rows that this this key came from. */
	source: Array<TRow>;

	/** The number of rows to occupy. */
	rows: number;

	/** The number of columns to occupy. */
	cols: number;
}

/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getKey A callback to generate a key containing the text and className used in the table from the source records,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 */
export function table<TRow extends Row>(cube: Cube<TRow>, axes: Axes<TRow>, getKey: Func<TRow, Key>, onX: boolean): Array<Array<Cell<TRow>>> {
	const identity = { index: 0 };

	// convert the source data to keys and remove resulting duplicates
	const cells = cube.map(row => row.map(table => table.length ? tableCells(table, getKey, identity) : [{ text: '', style: 'empty', index: [], source: [], rows: 1, cols: 1 }]));

	// create the resultant table
	return split(cells, axes, onX);
}

/**
 * Splits a cube of keys into a table, creating mutiple rows or columns where a cell in a cube has multiple values.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 */
export function split<TRow extends Row>(cells: Cube<Cell<TRow>>, axes: Axes<TRow>, onX: boolean): Array<Array<Cell<TRow>>> {
	// calcuate the x and y splits required
	const xSplits = axes.x.map((_, iX) => onX ? leastCommonMultiple(cells, row => row[iX].length) : 1);
	const ySplits = cells.map(row => onX ? 1 : leastCommonMultiple(row, table => table.length));

	// iterate and expand the y axis based on the split data
	return expand(cells, ySplits, (row, ySplit, ysi, iY) => {

		// iterate and expand the x axis based on the split data
		return expand(row, xSplits, (cell, xSplit, xsi) => {

			// generate the cube cells
			return { ...cell[Math.floor(cell.length * (ysi + xsi) / (xSplit * ySplit))] };

			// generate the y axis row header cells
		}, axes.y[iY].map(criterion => axis(criterion, 'y')));

		// generate the x axis column header rows
	}, axes.x[0].map((_, iC) => {

		// iterate and expand the x axis
		return expand(axes.x, xSplits, xPoint => {

			// generate the x axis cells
			return axis(xPoint[iC], 'x');

			// generate the x/y header
		}, axes.y[0].map(() => axis({ key: '', value: '' }, 'xy')));
	}));
}


/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export function merge<TRow extends Row>(cells: Array<Array<Cell<TRow>>>, onX: boolean, onY: boolean): void {
	let next;

	forEachRev(cells, (row, iY) => {
		forEachRev(row, (cell, iX) => {
			if (onY && iY && (next = cells[iY - 1][iX]) && keyEquals(next, cell) && next.cols === cell.cols) {
				next.rows += cell.rows;
				mergeContext(next, cell);
				row.splice(iX, 1);
			} else if (onX && iX && (next = row[iX - 1]) && keyEquals(next, cell) && next.rows === cell.rows) {
				next.cols += cell.cols;
				mergeContext(next, cell);
				row.splice(iX, 1);
			}
		});
	});
}

/**
 * Merges the context of two adjacent cells.
 * @hidden
 */
function mergeContext<TRow extends Row>(next: Cell<TRow>, cell: Cell<TRow>): void {
	cell.index.forEach((index, i) => {
		if (!next.index.includes(index)) {
			next.index.push(index);
			next.source.push(cell.source[i]);
		}
	});
}

/**
 * Convert a table of rows into a table of cells.
 * @hidden
 */
function tableCells<TRow extends Row>(table: Table<TRow>, getKey: Func<TRow, Key>, identity: { index: number }): Table<Cell<TRow>> {
	const result: Table<Cell<TRow>> = [];

	for (const row of table) {
		const key = getKey(row);
		const cell = result.find(cell => keyEquals(cell, key));

		if (cell) {
			cell.index.push(identity.index);
			cell.source.push(row);
		} else {
			result.push({ ...key, index: [identity.index], source: [row], rows: 1, cols: 1 });
		}

		identity.index++;
	}

	return result;
}


/**
 * Expands an array using, splitting values into multiple based on a set of corresponding splits then maps the data to a desired structure.
 * @hidden 
 */
function expand<TSource, TResult>(values: TSource[], splits: number[], callbackfn: (value: TSource, split: number, iSplit: number, iValue: number) => TResult, seed: TResult[]): TResult[] {
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
function forEachRev<TValue>(values: Array<TValue>, callbackfn: (value: TValue, index: number) => void): void {
	for (let index = values.length; index--;) {
		callbackfn(values[index], index);
	}
}

/**
 * Returns the least common multiple of a set of integers generated from an object. 
 * @hidden
 */
function leastCommonMultiple<TSource>(source: Array<TSource>, callbackfn: Func<TSource, number>): number {
	return source.map(value => callbackfn(value) || 1).reduce((a, b) => (a * b) / greatestCommonFactor(a, b));
}

/**
 * Returns the greatest common factor of two numbers
 * @hidden
 */
function greatestCommonFactor(a: number, b: number): number {
	return b ? greatestCommonFactor(b, a % b) : a;
}

/**
 * Compare two keys for equality
 * @hidden 
 */
function keyEquals(a: Key, b: Key): boolean {
	return a.text === b.text && a.style === b.style;
}

/**
 * Creates a cell within a table for a column or row heading.
 * @hidden 
 */
function axis<TRow extends Row>(pair: Pair, name: string): Cell<TRow> {
	return { text: pair.value, style: `axis ${name} ${pair.key}`, index: [], source: [], rows: 1, cols: 1 };
}
