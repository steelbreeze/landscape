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

export function split<TRow extends Row>(cube: Cube<TRow>, xAxis: Dimension<TRow>, yAxis: Dimension<TRow>, getKey: Func1<TRow, Key>, onX: boolean): Cell[][] {
	const counts = cube.map(row => row.map(cell => cell.length || 1));
	const xSplits = counts[0].map((_, index) => onX ? counts.map(row => row[index]).reduce(leastCommonMultiple) : 1);
	const ySplits = counts.map(row => onX ? 1 : row.reduce(leastCommonMultiple));

	return ySplits.reduce<Cell[][]>((result, ySplit, yIndex) => [...result, ...generate(ySplit, nyi => xSplits.reduce<Cell[]>((result, xSplit, xIndex) => [...result, ...generate(xSplit, nxi => {
		const table = cube[yIndex][xIndex];
		const index = Math.floor(table.length * (nyi + nxi) / (xSplit * ySplit));
		return cell(table.length ? getKey(table[index]) : { text: '', className: 'empty' });
	})], yAxis[yIndex].data.map(pair => cell({ className: `axis y ${pair.key}`, text: pair.value }))))], header(xAxis, yAxis, xSplits)); // NOTE: use the last [] as the header rows to avoud the [...[], ...[]] and same for xy headers
}

/**
 * Creates the x axis header (including the x/y header block)
 * @hidden
 */
function header<TRow extends Row>(xAxis: Dimension<TRow>, yAxis: Dimension<TRow>, xSplits: number[]): Cell[][] {
	return generate(xAxis[0].data.length, row => [...yAxis[0].data.map(() => cell({ className: 'axis xy', text: '' })), ...xAxis.reduce<Cell[]>((res, measure, index) => [...res, ...generate(xSplits[index], () => cell({ className: `axis x ${measure.data[row].key}`, text: measure.data[row].value }))], [])]);
}

/**
 * Creates a cell within a table
 * @hidden
 */
function cell(key: Key): Cell {
	return { ...key, rowSpan: 1, colSpan: 1 };
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