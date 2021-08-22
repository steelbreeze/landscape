// @steelbreeze/landscape
// Copyright (c) 2019-21 David Mesquita-Morris
import { Cube, Dimension, Func1, Func2, Row } from '@steelbreeze/pivot';

/** The final text and class name to use when rendering cells in a table. */
export interface Key {
	/** The text to use in the final table rendering. */
	text: string;

	/** The class name to use in the final table rendering. */
	className: string;
}

/** An extension of key, adding the number of rows and columns the key will occupy in the final table rendering. */
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
export function table<TRow extends Row>(cube: Cube<TRow>, xAxis: Dimension<TRow>, yAxis: Dimension<TRow>, getKey: Func1<TRow, Key>, onX: boolean): Array<Array<Cell>> {
	const xSplits = xAxis.map((_, xIndex) => onX ? cube.map(row => row[xIndex].length || 1).reduce(leastCommonMultiple) : 1);
	const ySplits = cube.map(row => row.map(table => onX ? 1 : table.length || 1).reduce(leastCommonMultiple));

	// iterate and expand the y axis
	return expand(cube, ySplits, (row, ySplit, ysi, yIndex) => {

		// iterate and expand the x axis
		return expand(row, xSplits, (values, xSplit, xsi) => {

			// generate data cell
			return cell(values.length ? getKey(values[Math.floor(values.length * (ysi + xsi) / (xSplit * ySplit))]) : { text: '', className: 'empty' });

			// generate the y axis header cells
		}, yAxis[yIndex].data.map(pair => axis(pair, 'y')));
	},
		// generate the x axis header rows
		xAxis[0].data.map((_, yIndex) => {

			// generate an x header row
			return expand(xAxis, xSplits, xPoint => {

				// generate an x header row cell
				return axis(xPoint.data[yIndex], 'x');

				// create the x/y header cells
			}, yAxis[0].data.map(() => axis({ key: '', value: '' }, 'xy')));
		})
	);
}

/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param table A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export function merge(table: Array<Array<Cell>>, onX: boolean, onY: boolean): void {
	let next;

	forEachRev(table, (row, iY) => {
		forEachRev(row, (value, iX) => {
			if (onY && iY && (next = table[iY - 1][iX]) && keyEquals(next, value) && next.colSpan === value.colSpan) {
				next.rowSpan += value.rowSpan;

				row.splice(iX, 1);
			} else if (onX && iX && (next = row[iX - 1]) && keyEquals(next, value) && next.rowSpan === value.rowSpan) {
				next.colSpan += value.colSpan;

				row.splice(iX, 1);
			}
		});
	});
}

/**
 * Expands an array using, splitting values into multiple based on a set of corresponding splits then maps the data to a desired structure.
 * @hidden 
 */
function expand<TSource, TResult>(values: TSource[], splits: number[], callbackfn: (value: TSource, split: number, splitIndex: number, valueIndex: number) => TResult, seed: TResult[]): TResult[] {
	values.forEach((value, valueIndex) => {
		const split = splits[valueIndex];

		for (let splitIndex = 0; splitIndex < split; ++splitIndex) {
			seed.push(callbackfn(value, split, splitIndex, valueIndex));
		}
	});

	return seed;
}

/**
 * A reverse for loop
 * @param hidden
 */
function forEachRev<TValue>(values: Array<TValue>, callbackfn: Func2<TValue, number, void>): void {
	for (let index = values.length; index--;) {
		callbackfn(values[index], index);
	}
}

/**
 * Compare two keys for equality
 * @hidden 
 */
function keyEquals(a: Key, b: Key): boolean {
	return a.text === b.text && a.className === b.className;
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

/**
 * Creates a cell within a table for a column or row heading.
 * @hidden 
 */
function axis(pair: { key: string, value: string }, name: string): Cell {
	return cell({ text: pair.value, className: `axis ${name} ${pair.key}` });
}
