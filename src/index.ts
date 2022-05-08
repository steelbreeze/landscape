import { Callback, FunctionVA, Pair } from '@steelbreeze/types';
import { Axes, Cube } from '@steelbreeze/pivot';

/** Information required for styling an element when rendering. */
export interface Style {
	/** The class name to use in the final table rendering. */
	style: string;

	/** Optional text to display in place of Pair.value (which is used to de-dup); this should have a single value for any given Pair.value. */
	text?: string;
}

/** Layout information catering for merged adjacent cells. */
export interface Layout {
	/** The number of rows to occupy. */
	rows: number;

	/** The number of columns to occupy. */
	cols: number;
}

/** The final text and class name to use when rendering cells in a table. */
export type Element = Pair & Style;

/** An extension of Element, adding the layout information the Cell will occupy in the final table rendering. */
export type Cell = Element & Layout;

/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getElement A callback to generate an element containing the details used in table rendering,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param method A function used to calculate how many rows or columns to split a row/column into based on the number of entries in each cell of that row/column. Defaults to Math.max, but other methods such as Least Common Multiple can be used for more precise table rendering.
 */
export const table = <TRow>(cube: Cube<TRow>, axes: Axes<TRow>, getElement: Callback<TRow, Element>, onX: boolean, method: FunctionVA<number, number> = Math.max): Array<Array<Cell>> => {
	// transform the cube of rows into a cube of cells
	const cells = cube.map(slice => slice.map(table => table.length ? table.map((row, index) => ({ ...getElement(row, index, table), rows: 1, cols: 1 })) : [cell('empty')]));

	// calcuate the x splits required (y splits inlined below)
	const xSplits: Array<number> = axes.x.map((_, iX) => onX ? method(...cells.map(row => row[iX].length)) : 1);

	// generate the whole table
	return expand(cells, cells.map(row => onX ? 1 : method(...row.map(table => table.length))),
		// generate x axis header rows
		axes.x[0].map((_, iC) => expand(axes.x, xSplits,
			// generate the x/y header
			axes.y[0].map(() => cell('axis xy')),

			// generate the x axis cells
			(x) => cell(`axis x ${x[iC].key}`, x[iC].value)
		)),
		// iterate and expand the x axis based on the split data
		(row, ySplit, ysi, iY) => expand(row, xSplits,
			// generate the y axis row header cells
			axes.y[iY].map(criterion => cell(`axis y ${criterion.key}`, criterion.value)),

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
export const merge = (cells: Array<Array<Cell>>, onX: boolean, onY: boolean): void => {
	let iY = cells.length, row, iX, cell, next;

	while (iY--) {
		row = cells[iY];
		iX = row.length;

		while (iX--) {
			cell = row[iX];

			if (onY && iY && (next = cells[iY - 1][iX]) && equals(next, cell, 'cols')) {
				next.rows += cell.rows;
				row.splice(iX, 1);
			} else if (onX && iX && (next = row[iX - 1]) && equals(next, cell, 'rows')) {
				next.cols += cell.cols;
				row.splice(iX, 1);
			}
		}
	}
}

/**
 * Creates a cell within a table.
 * @hidden
 */
const cell = (style: string, value: string = '', key = ''): Cell => ({ key, value, style, rows: 1, cols: 1 });

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
const equals = (a: Cell, b: Cell, key: keyof Cell): boolean =>
	a.value === b.value && a.style === b.style && a[key] === b[key];
