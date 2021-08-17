"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.table = void 0;
/**
 * Generates a table from a cube and its axis.
 * @param cube The source cube.
 * @param xAxis The x axis.
 * @param yAxis The y axis.
 * @param getKey A callback to generate a key containing the text and className used in the table from the source records,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 */
function table(cube, xAxis, yAxis, getKey, onX) {
    // for each row and column, determine how many sub rows and columns we need to split it into; this is the LCM of the counts of items in that row or column
    const xSplits = generate(xAxis.length, index => onX ? cube.map(row => row[index].length || 1).reduce(leastCommonMultiple) : 1);
    const ySplits = cube.map(row => row.map(table => onX ? 1 : table.length || 1).reduce(leastCommonMultiple));
    // generate the table from the cube, split cell with more than one value by row or column based on the splits calculated
    return expand(ySplits, (ySplit, yIndex) => generate(ySplit, nyi => expand(xSplits, (xSplit, xIndex) => generate(xSplit, nxi => {
        const items = cube[yIndex][xIndex];
        return cell(items.length ? getKey(items[Math.floor(items.length * (nyi + nxi) / (xSplit * ySplit))]) : { text: '', className: 'empty' });
    }), 
    // generate the row headings
    yAxis[yIndex].data.map(pair => cell({ className: `axis y ${pair.key}`, text: pair.value })))), 
    // generate the column headings
    generate(xAxis[0].data.length, row => expand(xSplits, (xSplit, xIndex) => generate(xSplit, () => cell({ className: `axis x ${xAxis[xIndex].data[row].key}`, text: xAxis[xIndex].data[row].value })), yAxis[0].data.map(() => cell({ className: 'axis xy', text: '' })))));
}
exports.table = table;
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param table A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
function merge(table, onX = true, onY = true) {
    let next;
    forReverse(table, (row, iY) => {
        forReverse(row, (cell, iX) => {
            if (onY && iY && (next = table[iY - 1][iX]) && next.text === cell.text && next.className === cell.className && next.colSpan === cell.colSpan) {
                next.rowSpan += cell.rowSpan;
                row.splice(iX, 1);
            }
            else if (onX && iX && (next = row[iX - 1]) && next.text === cell.text && next.className === cell.className && next.rowSpan === cell.rowSpan) {
                next.colSpan += cell.colSpan;
                row.splice(iX, 1);
            }
        });
    });
}
exports.merge = merge;
/**
 * Reverse for loop.
 * @hidden
 */
function forReverse(source, callback) {
    for (let index = source.length; index--;) {
        callback(source[index], index);
    }
}
/**
 * Expand one array into another.
 * @hidden
 */
function expand(source, expander, result) {
    source.forEach((value, index) => result.push(...expander(value, index)));
    return result;
}
/**
 * Generate n records.
 * @hidden
 */
function generate(length, generator) {
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
 * Creates a cell within a table, augmenting a key with row and column span detail
 * @hidden
 */
function cell(key) {
    return Object.assign(Object.assign({}, key), { rowSpan: 1, colSpan: 1 });
}
