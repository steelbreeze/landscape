"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.table = void 0;
/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param x The dimension used as the x axis.
 * @param y The dimension used as the y axis.
 * @param getKey A callback to generate a key containing the text and className used in the table from the source records,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 */
function table(cube, x, y, getKey, onX) {
    const xSplits = x.map((_, iX) => onX ? leastCommonMultiple(cube, row => row[iX].length) : 1);
    const ySplits = cube.map(row => onX ? 1 : leastCommonMultiple(row, table => table.length));
    // iterate and expand the y axis based on the split data
    return expand(cube, ySplits, (row, ySplit, ysi, iY) => {
        // iterate and expand the x axis based on the split data
        return expand(row, xSplits, (values, xSplit, xsi) => {
            // generate the cube cells
            return cell(values.length ? getKey(values[Math.floor(values.length * (ysi + xsi) / (xSplit * ySplit))]) : { text: '', style: 'empty' });
            // generate the y axis row header cells
        }, y[iY].data.map(pair => axis(pair, 'y')));
        // generate the x axis column header rows
    }, x[0].data.map((_, iY) => {
        // iterate and expand the x axis
        return expand(x, xSplits, xPoint => {
            // generate the x axis cells
            return axis(xPoint.data[iY], 'x');
            // generate the x/y header
        }, y[0].data.map(() => axis({ key: '', value: '' }, 'xy')));
    }));
}
exports.table = table;
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param table A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
function merge(table, onX, onY) {
    let next;
    forEachRev(table, (row, iY) => {
        forEachRev(row, (value, iX) => {
            if (onY && iY && (next = table[iY - 1][iX]) && keyEquals(next, value) && next.cols === value.cols) {
                next.rows += value.rows;
                row.splice(iX, 1);
            }
            else if (onX && iX && (next = row[iX - 1]) && keyEquals(next, value) && next.rows === value.rows) {
                next.cols += value.cols;
                row.splice(iX, 1);
            }
        });
    });
}
exports.merge = merge;
/**
 * Expands an array using, splitting values into multiple based on a set of corresponding splits then maps the data to a desired structure.
 * @hidden
 */
function expand(values, splits, callbackfn, seed) {
    values.forEach((value, iValue) => {
        const split = splits[iValue];
        for (let iSplit = 0; iSplit < split; ++iSplit) {
            seed.push(callbackfn(value, split, iSplit, iValue));
        }
    });
    return seed;
}
/**
 * A reverse for loop
 * @param hidden
 */
function forEachRev(values, callbackfn) {
    for (let index = values.length; index--;) {
        callbackfn(values[index], index);
    }
}
/**
 * Compare two keys for equality
 * @hidden
 */
function keyEquals(a, b) {
    return a.text === b.text && a.style === b.style;
}
/**
 * Returns the least common multiple of a set of integers generated from an object.
 * @hidden
 */
function leastCommonMultiple(source, callbackfn) {
    return source.map(value => callbackfn(value) || 1).reduce((a, b) => (a * b) / greatestCommonFactor(a, b));
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
    return { ...key, rows: 1, cols: 1 };
}
/**
 * Creates a cell within a table for a column or row heading.
 * @hidden
 */
function axis(pair, name) {
    return cell({ text: pair.value, style: `axis ${name} ${pair.key}` });
}
