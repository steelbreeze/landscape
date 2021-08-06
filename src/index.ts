// @steelbreeze/landscape
// Copyright (c) 2019-21 David Mesquita-Morris
import { Axis, Cube, Func1, Row, Table } from '@steelbreeze/pivot';

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
 * Converts a pivoted cube and its axes into a table structure. Where a cell in the cube contains multiple values, multiple columns will be generated.
 * @param cube The source cube.
 * @param yAxis The y axis.
 * @param xAxis The x axis.
 * @param getKey A callback to extract the Key from the source data.
 */
export function splitX<TRow extends Row>(cube: Cube<TRow>, yAxis: Axis<TRow>, xAxis: Axis<TRow>, getKey: Func1<TRow, Key>): Cell[][] {
	const xSplits = generate(xAxis.length, index => cube.map(row => row[index].length || 1).reduce(leastCommonMultiple));

	const mapped = cube.map((row, ri) => [...yHeaderRow(yAxis, ri), ...row.reduce<Cell[]>((res, c, index) => [...res, ...generate(xSplits[index], nri => dataCell(c, nri / xSplits[index], getKey))], [])]);

	return [...header(yAxis, xAxis, xSplits), ...mapped];
}

/**
 * Converts a pivoted cube and its axes into a table structure. Where a cell in the cube contains multiple values, multiple rows will be generated.
 * @param cube The source cube.
 * @param yAxis The y axis.
 * @param xAxis The x axis.
 * @param getKey A callback to extract the Key from the source data.
 */
export function splitY<TRow extends Row>(cube: Cube<TRow>, yAxis: Axis<TRow>, xAxis: Axis<TRow>, getKey: Func1<TRow, Key>): Cell[][] {
	const ySplits = cube.map(row => row.map(cell => cell.length || 1).reduce(leastCommonMultiple));
	const xSplits = xAxis.map(() => 1);

	const mapped = cube.reduce<Cell[][]>((res, row, index) => [...res, ...generate(ySplits[index], nri => [...yHeaderRow(yAxis, index), ...row.map(c => dataCell(c, nri / ySplits[index], getKey))])], []);

	return [...header(yAxis, xAxis, xSplits), ...mapped];
}

function header<TRow extends Row>(yAxis: Axis<TRow>, xAxis: Axis<TRow>, xSplits: number[]) {
	return generate(xAxis[0].pairs.length, row => [...yAxis[0].pairs.map(() => cell({ className: 'axis xy', text: '' })), ...xAxis.reduce<Cell[]>((res, c, index) => [...res, ...generate(xSplits[index], () => cell({ className: `axis x ${c.pairs[row].key}`, text: c.pairs[row].value }))], [])]);
}

/**
 * Creates the y axis header section of a row
 * @hidden 
 */
function yHeaderRow<TRow extends Row>(yAxis: Axis<TRow>, row: number): Cell[] {
	return yAxis[row].pairs.map(pair => cell({ className: `axis y ${pair.key}`, text: pair.value }));
}

/**
 * Creates a data cell.
 * @hidden
 */
function dataCell<TRow extends Row>(table: Table<Row>, factor: number, getKey: Func1<TRow, Key>): Cell {
	return cell(table.length ? getKey(table[Math.floor(table.length * factor)]) : { className: 'empty', text: '' });
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