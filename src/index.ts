// @steelbreeze/landscape
// Copyright (c) 2019-21 David Mesquita-Morris
import { Cube, Dimension, Func1, Row } from '@steelbreeze/pivot';

/**
 * The final text and class name to use when rendering cells in a table.
 */
export interface Key {
	/** The text to use in the final table rendering. */
	text: string;

	/** The class name to use in the final table rendering. */
	className: string;
}

/**
 * An extension of key, adding the number of rows and columns the key will occupy in the final table rendering.
 */
export interface Cell extends Key {
	/** The number of rows to occupy. */
	rowSpan: number;

	/** The number of columns to occupy. */
	colSpan: number;
}

/**
 * Generates a table from a cube and its axis.
 * @param cube The source cube.
 * @param xAxis The x axis.
 * @param yAxis The y axis.
 * @param getKey A callback to generate a key containing the text and className used in the table from the source records,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 */
export function table<TRow extends Row>(cube: Cube<TRow>, xAxis: Dimension<TRow>, yAxis: Dimension<TRow>, getKey: Func1<TRow, Key>, onX: boolean): Cell[][] {
	// for each row and column, determine how many sub rows and columns we need to split it into; this is the LCM of the counts of items in that row or column
	const xSplits = generate(xAxis.length, index => onX ? cube.map(row => row[index].length || 1).reduce(leastCommonMultiple) : 1);
	const ySplits = cube.map(row => row.map(table => onX ? 1 : table.length || 1).reduce(leastCommonMultiple));

	// expand the cube based on the splits and add in the row and column headings
	return ySplits.reduce<Cell[][]>((result, ySplit, yIndex) => [...result, ...generate(ySplit, nyi => xSplits.reduce<Cell[]>((result, xSplit, xIndex) => [...result, ...generate(xSplit, nxi => {
		const table = cube[yIndex][xIndex];
		const index = Math.floor(table.length * (nyi + nxi) / (xSplit * ySplit));
		return cell(table.length ? getKey(table[index]) : { text: '', className: 'empty' });
	})], yAxis[yIndex].data.map(pair => cell({ className: `axis y ${pair.key}`, text: pair.value }))))], generate(xAxis[0].data.length, row => xSplits.reduce<Cell[]>((result, xSplit, xIndex) => [...result, ...generate(xSplit, () => cell({ className: `axis x ${xAxis[xIndex].data[row].key}`, text: xAxis[xIndex].data[row].value }))], yAxis[0].data.map(() => cell({ className: 'axis xy', text: '' })))));
}

/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param table A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export function merge(table: Array<Array<Cell>>, onX = true, onY = true): void {
	let next;

	for (let iY = table.length; iY--;) {
		for (let iX = table[iY].length; iX--;) {
			const cell = table[iY][iX];

			if (onY && iY && (next = table[iY - 1][iX]) && next.text === cell.text && next.className === cell.className && next.colSpan === cell.colSpan) {
				next.rowSpan += cell.rowSpan;

				table[iY].splice(iX, 1);
			} else if (onX && iX && (next = table[iY][iX - 1]) && next.text === cell.text && next.className === cell.className && next.rowSpan === cell.rowSpan) {
				next.colSpan += cell.colSpan;

				table[iY].splice(iX, 1);
			}
		}
	}
}

/**
 * Create any array of numbers from 0 to n
 * @hidden
 */
function generate<TResult>(length: number, generator: Func1<number, TResult>): Array<TResult> {
	const result = [];

	for (let i = 0; i < length; i++) {
		result.push(generator(i));
	}

	return result;
}

/**
 * Returns the least common multiple of two integers
 * @hidden
 */
function leastCommonMultiple(a: number, b: number): number {
	return (a * b) / greatestCommonFactor(a, b);
}

/**
 * Returns the greatest common factor of two numbers
 * @hidden
 */
function greatestCommonFactor(a: number, b: number): number {
	return b ? greatestCommonFactor(b, a % b) : a;
}

/**
 * Creates a cell within a table, augmenting a key with row and column span detail
 * @hidden
 */
function cell(key: Key): Cell {
	return { ...key, rowSpan: 1, colSpan: 1 };
}
