"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.split = void 0;
function split(cube, xAxis, yAxis, getKey, onX) {
    const counts = cube.map(row => row.map(cell => cell.length || 1));
    const xSplits = counts[0].map((_, index) => onX ? counts.map(row => row[index]).reduce(leastCommonMultiple) : 1);
    const ySplits = counts.map(row => onX ? 1 : row.reduce(leastCommonMultiple));
    return ySplits.reduce((result, ySplit, yIndex) => [...result, ...generate(ySplit, nyi => xSplits.reduce((result, xSplit, xIndex) => [...result, ...generate(xSplit, nxi => {
                const table = cube[yIndex][xIndex];
                const index = Math.floor(table.length * (nyi + nxi) / (xSplit * ySplit));
                return cell(table.length ? getKey(table[index]) : { text: '', className: 'empty' });
            })], yAxis[yIndex].data.map(pair => cell({ className: `axis y ${pair.key}`, text: pair.value }))))], header(xAxis, yAxis, xSplits)); // NOTE: use the last [] as the header rows to avoud the [...[], ...[]] and same for xy headers
}
exports.split = split;
/**
 * Creates the x axis header (including the x/y header block)
 * @hidden
 */
function header(xAxis, yAxis, xSplits) {
    return generate(xAxis[0].data.length, row => [...yAxis[0].data.map(() => cell({ className: 'axis xy', text: '' })), ...xAxis.reduce((res, measure, index) => [...res, ...generate(xSplits[index], () => cell({ className: `axis x ${measure.data[row].key}`, text: measure.data[row].value }))], [])]);
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
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
function merge(table, onX = true, onY = true) {
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
function generate(length, generator) {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(generator(i));
    }
    return result;
}
