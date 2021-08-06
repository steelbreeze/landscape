"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.splitY = exports.splitX = void 0;
/**
 * Converts a pivoted cube and its axes into a table structure. Where a cell in the cube contains multiple values, multiple columns will be generated.
 * @param cube The source cube.
 * @param yAxis The y axis.
 * @param xAxis The x axis.
 * @param getKey A callback to extract the Key from the source data.
 */
function splitX(cube, yAxis, xAxis, getKey) {
    const xSplits = generate(xAxis.length, index => cube.map(row => row[index].length || 1).reduce(leastCommonMultiple));
    //	const header = generate(xAxis[0].pairs.length, row => [...xyHeaderRow(yAxis), ...xHeaderRow(xAxis, row, xSplits)]);
    const mapped = cube.map((row, ri) => [...yHeaderRow(yAxis, ri), ...row.reduce((res, c, index) => [...res, ...generate(xSplits[index], nri => dataCell(c, nri / xSplits[index], getKey))], [])]);
    return [...head(yAxis, xAxis, xSplits), ...mapped];
}
exports.splitX = splitX;
/**
 * Converts a pivoted cube and its axes into a table structure. Where a cell in the cube contains multiple values, multiple rows will be generated.
 * @param cube The source cube.
 * @param yAxis The y axis.
 * @param xAxis The x axis.
 * @param getKey A callback to extract the Key from the source data.
 */
function splitY(cube, yAxis, xAxis, getKey) {
    const ySplits = cube.map(row => row.map(cell => cell.length || 1).reduce(leastCommonMultiple));
    const xSplits = xAxis.map(() => 1);
    //	const header = head(yAxis, xAxis, xSplits);//generate(xAxis[0].pairs.length, row => [...xyHeaderRow(yAxis), ...xHeaderRow(xAxis, row, xSplits)]);
    const mapped = cube.reduce((res, row, index) => [...res, ...generate(ySplits[index], nri => [...yHeaderRow(yAxis, index), ...row.map(c => dataCell(c, nri / ySplits[index], getKey))])], []);
    return [...head(yAxis, xAxis, xSplits), ...mapped];
}
exports.splitY = splitY;
function head(yAxis, xAxis, xSplits) {
    return generate(xAxis[0].pairs.length, row => [...yAxis[0].pairs.map(() => cell({ className: 'axis xy', text: '' })), ...xAxis.reduce((res, c, index) => [...res, ...generate(xSplits[index], () => cell({ className: `axis x ${c.pairs[row].key}`, text: c.pairs[row].value }))], [])]);
}
/**
 * Creates a single row of the xy header block.
 * @hidden
 */
//function xyHeaderRow<TRow extends Row>(yAxis: Axis<TRow>): Cell[] {
//	return yAxis[0].pairs.map(() => cell({ className: 'axis xy', text: '' }));
//}
/**
 * Creates the y axis header section of a row
 * @hidden
 */
function yHeaderRow(yAxis, row) {
    return yAxis[row].pairs.map(pair => cell({ className: `axis y ${pair.key}`, text: pair.value }));
}
//function xHeaderRow<TRow extends Row>(xAxis: Axis<TRow>, row: number, xSplits: number[]): Cell[] {
//	return xAxis.reduce<Cell[]>((res, c, index) => [...res, ...generate(xSplits[index], () => cell({ className: `axis x ${c.pairs[row].key}`, text: c.pairs[row].value }))], [])
//}
/**
 * Creates a data cell.
 * @hidden
 */
function dataCell(table, factor, getKey) {
    return cell(table.length ? getKey(table[Math.floor(table.length * factor)]) : { className: 'empty', text: '' });
}
/**
 * Creates a cell within a table
 * @hidden
 */
function cell(key) {
    return Object.assign(Object.assign({}, key), { rowSpan: 1, colSpan: 1 });
}
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param table A table of Cells created by a previous call to splitX or splitY.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 */
function merge(table, onY = true, onX = true) {
    let next;
    for (let iY = table.length; iY--;) {
        for (let iX = table[iY].length; iX--;) {
            const cell = table[iY][iX];
            if (onY && iY && (next = table[iY - 1][iX]) && next.text === cell.text && next.className === cell.className && next.colSpan === cell.colSpan) {
                next.rowSpan += cell.rowSpan;
                table[iY].splice(iX, 1);
            }
            else if (onX && iX && (next = table[iY][iX - 1]) && next.text === cell.text && next.className === cell.className && next.rowSpan === cell.rowSpan) {
                next.colSpan += cell.colSpan;
                table[iY].splice(iX, 1);
            }
        }
    }
}
exports.merge = merge;
/**
 * Returns the least common multiple of two integers
 * @hidden
 */
function leastCommonMultiple(a, b) {
    return (a * b) / greatestCommonFactor(a, b);
}
/**
 * Returns the greatest common factor of two numbers
 * @hidden
 */
function greatestCommonFactor(a, b) {
    return b ? greatestCommonFactor(b, a % b) : a;
}
/**
 * Create any array of numbers from 0 to n
 * @hidden
 */
function generate(size, f) {
    const result = [];
    for (let i = 0; i < size; i++) {
        result.push(f(i));
    }
    return result;
}
