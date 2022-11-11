import { Callback, FunctionVA, Pair, Predicate } from '@steelbreeze/types';
import { Cube } from '@steelbreeze/pivot';

/** Specialised criteria for landscape maps. */
export type Criteria<TRecord> = Predicate<TRecord> & { metadata: Array<Pair<keyof TRecord, TRecord[keyof TRecord]>> };

export type Dimension<TRecord> = Array<Criteria<TRecord>>;

/** Styling information for rendering purposes. */
export interface Style {
	/** The class name to use in the final table rendering. */
	style: string;

	/** Optional text to display in place of Pair.value (which is used to de-dup); this should have a single value for any given Pair.value. */
	text?: string;
}

/** Table layout for rendering purposes. */
export interface Layout {
	/** The number of rows to occupy. */
	rows: number;

	/** The number of columns to occupy. */
	cols: number;
}

/** The final text and class name to use when rendering cells in a table. */
export type Element = Pair<string | number, any> & Style;

/** An extension of Element, adding the number of rows and columns the element will occupy in the final table rendering. */
export type Cell = Element & Layout;

/**
 * Default criteria creator with simple metadata.
 * @param key The property within the source data to use as 
 */
export const criteria = <TRecord>(key: keyof TRecord): Callback<TRecord[keyof TRecord], Criteria<TRecord>> =>
	value => Object.assign((record: TRecord) => record[key] === value, { metadata: [{ key, value }] });

/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param y The y axis used in the pivot operation to create the cube.
 * @param x The x axis used in the pivot operation to create the cube.
 * @param getElement A callback to generate an element containing the details used in table rendering,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param method A function used to calculate how many rows or columns to split a row/column into based on the number of entries in each cell of that row/column. Defaults to Math.max, but other methods such as Least Common Multiple can be used for more precise table rendering.
 */
export const table = <TRecord>(cube: Cube<TRecord>, y: Dimension<TRecord>, x: Dimension<TRecord>, getElement: Callback<TRecord, Element>, onX: boolean, method: FunctionVA<number, number> = Math.max): Array<Array<Cell>> => {
	// transform the cube of rows into a cube of cells
	const cells = cube.map(slice => slice.map(table => transform(table, getElement)));

	// calcuate the x splits required (y splits inlined below)
	const xSplits: Array<number> = x.map((_, iX) => onX ? method(...cells.map(row => row[iX].length)) : 1);

	// generate the whole table
	return expand(cells, cells.map(row => onX ? 1 : method(...row.map(table => table.length))),
		// generate x axis header rows
		x[0].metadata.map((_, iC) => expand(x, xSplits,
			// generate the x/y header
			y[0].metadata.map(() => newCell('axis xy')),

			// generate the x axis cells
			criteria => newCell(`axis x ${String(criteria.metadata[iC].key)}`, String(criteria.metadata[iC].value))
		)),
		// iterate and expand the x axis based on the split data
		(row, ySplit, ysi, iY) => expand(row, xSplits,
			// generate the y axis row header cells
			y[iY].metadata.map((pair) => newCell(`axis y ${String(pair.key)}`, String(pair.value))),

			// generate the cube cells
			(cell, xSplit, xsi) => ({ ...cell[Math.floor(cell.length * (ysi + xsi) / (xSplit * ySplit))] })
		)
	);
}

/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export const merge = (cells: Array<Array<Cell>>, onX: boolean, onY: boolean): void =>
	reverse(cells, (iY, row) =>
		reverse(row, (iX, cell) =>
			onY && iY && mergeCells(cells[iY - 1][iX], cell, 'cols', 'rows', row, iX) || onX && iX && mergeCells(row[iX - 1], cell, 'rows', 'cols', row, iX)
		)
	);

/**
 * Merge two adjacent cells if they are equivalent
 * @hidden
 */
const mergeCells = (next: Cell, cell: Cell, compareKey: keyof Layout, mergeKey: keyof Layout, row: Array<Cell>, iX: number): boolean => {
	if (equals(next, cell, compareKey)) {
		next[mergeKey] += cell[mergeKey];
		row.splice(iX, 1);

		return true;
	}

	return false;
}

/**
 * Transform an array of rows into an array of cells.
 * @hidden
 */
const transform = <TRecord>(table: Array<TRecord>, getElement: Callback<TRecord, Element>): Array<Cell> =>
	table.reduce<Array<Cell>>((result, row, index) => {
		const element = getElement(row, index, table);

		if (!result.some(cell => equals(cell, element))) {
			result.push(cellFromElement(element));
		}

		return result;
	}, table.length ? [] : [newCell('empty')]);

/**
 * Creates a cell within a table from an element.
 * @hidden
 */
const cellFromElement = (element: Element): Cell => ({ ...element, rows: 1, cols: 1 });

/**
 * Creates a cell within a table from scratch
 * @hidden
 */
const newCell = (style: string, value: string = ''): Cell => cellFromElement({ key: '', value, style });

/**
 * Expands an array using, splitting values into multiple based on a set of corresponding splits then maps the data to a desired structure.
 * @hidden 
 */
const expand = <TSource, TResult>(values: TSource[], splits: number[], seed: TResult[], callbackfn: (value: TSource, split: number, iSplit: number, iValue: number) => TResult): TResult[] => {
	for (let length = values.length, iValue = 0; iValue < length; ++iValue) {
		for (let split = splits[iValue], iSplit = 0; iSplit < split; ++iSplit) {
			seed.push(callbackfn(values[iValue], split, iSplit, iValue));
		}
	}

	return seed;
}

/**
 * Compare two Elements for equality, using value, style and optionally, one other property.
 * @hidden 
 */
const equals = <TElement extends Element>(a: TElement, b: TElement, key?: keyof TElement): boolean =>
	a?.value === b.value && a.style === b.style && (!key || a[key] === b[key]);

/**
 * Reverse iterate an array.
 * @param hidden
 */
const reverse = <TValue>(values: Array<TValue>, callback: (index: number, value: TValue) => void): void => {
	for (let index = values.length; index--;) {
		callback(index, values[index]);
	}
}
