// @steelbreeze/landscape
// Copyright (c) 2021 David Mesquita-Morris
import { Axis, Cube, Func1, Row } from '@steelbreeze/pivot';

/** The final text and class name to use when rendering cells in a table. */
export interface Key {
	text: string;
	className: string;
}

export interface Cell extends Key {
	rowSpan: number;
	colSpan: number;
}

/**
 * Converts a pivoted cube into a table structure, including axes turning cube cells with multiple values into columns.
 * @param cube The source cube
 * @param yAxis The yA
 * @param xAxis 
 * @param getKey 
 * @returns 
 */
export function splitX<TRow extends Row>(cube: Cube<TRow>, yAxis: Axis<TRow>, xAxis: Axis<TRow>, getKey: Func1<TRow, Key>): Cell[][] {
	const splits = generate(xAxis.length, index => cube.map(row => row[index].length || 1).reduce(leastCommonMultiple));

	const header = generate(xAxis[0].pairs.length, row => [...generate(yAxis[0].pairs.length, () => xyAxisCell), ...xAxis.reduce<Cell[]>((res, c, index) => [...res, ...generate(splits[index], () => cell({ className: `axis x ${c.pairs[row].key}`, text: c.pairs[row].value }))], [])]);
	const mapped = cube.map((row, ri) => [...yAxis[ri].pairs.map((pair) => cell({ className: `axis y ${pair.key}`, text: pair.value })), ...row.reduce<Cell[]>((res, c, index) => [...res, ...generate(splits[index], nri => cell(c.length ? getKey(c[Math.floor(nri / splits[index] * c.length)]) : emptyKey))], [])]);

	return [...header, ...mapped];
}

export function splitY<TRow extends Row>(cube: Cube<TRow>, yAxis: Axis<TRow>, xAxis: Axis<TRow>, getKey: Func1<TRow, Key>): Cell[][] {
	const splits = cube.map(row => row.map(cell => cell.length || 1).reduce(leastCommonMultiple));

	const header = generate(xAxis[0].pairs.length, row => [...generate(yAxis[0].pairs.length, () => xyAxisCell), ...xAxis.map(s => cell({ className: `axis x ${s.pairs[row].key}`, text: s.pairs[row].value }))]);
	const mapped = cube.reduce<Cell[][]>((res, row, index) => [...res, ...generate(splits[index], nri => [...yAxis[index].pairs.map(pair => cell({ className: `axis y ${pair.key}`, text: pair.value })), ...row.map(rec => cell(rec.length ? getKey(rec[Math.floor(rec.length * nri / splits[index])]) : emptyKey))])], []);

	return [...header, ...mapped];
}

/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param table A table of Cells created by a previous call to splitX or splitY.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 */
export function merge(table: Array<Array<Cell>>, onY = true, onX = true): void {
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
function generate<TResult>(size: number, f: (index: number) => TResult): Array<TResult> {
	const result = [];

	for (let i = 0; i < size; i++) {
		result.push(f(i));
	}

	return result;
}

/**
 * Creates a cell within a table
 * @hidden
 */
 function cell(key: Key): Cell {
	return { ...key, rowSpan: 1, colSpan: 1 };
}

// constants used in a variety of places
const xyAxisCell = cell({ className: 'axis xy', text: '' });
const emptyKey = { className: 'empty', text: '' };
