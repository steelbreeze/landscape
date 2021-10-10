"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.split = exports.table = void 0;
/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getKey A callback to generate a key containing the text and className used in the table from the source records,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 */
function table(cube, axes, getKey, onX) {
    // convert the source data to keys and remove resulting duplicates
    const keys = cube.map(row => row.map(table => table.length ? tableKeys(table, getKey) : [{ text: '', style: 'empty', source: [], rows: 1, cols: 1 }]));
    // create the resultant table
    return split(keys, axes, onX);
}
exports.table = table;
/**
 * Convert a table of rows into a table of keys.
 * @param table
 * @param getKey
 * @returns
 */
function tableKeys(table, getKey) {
    const result = [];
    for (const row of table) {
        const key = getKey(row);
        const existing = result.find(k => keyEquals(k, key));
        if (existing) {
            existing.source.push(row);
        }
        else {
            result.push({ ...key, source: [row], rows: 1, cols: 1 });
        }
    }
    return result;
}
/**
 * Splits a cube of keys into a table, creating mutiple rows or columns where a cell in a cube has multiple values.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 */
function split(keys, axes, onX) {
    // calcuate the x and y splits required
    const xSplits = axes.x.map((_, iX) => onX ? leastCommonMultiple(keys, row => row[iX].length) : 1);
    const ySplits = keys.map(row => onX ? 1 : leastCommonMultiple(row, table => table.length));
    // iterate and expand the y axis based on the split data
    return expand(keys, ySplits, (row, ySplit, ysi, iY) => {
        // iterate and expand the x axis based on the split data
        return expand(row, xSplits, (values, xSplit, xsi) => {
            // generate the cube cells
            return { ...(values[Math.floor(values.length * (ysi + xsi) / (xSplit * ySplit))]) };
            // generate the y axis row header cells
        }, axes.y[iY].map(criterion => axis(criterion, 'y')));
        // generate the x axis column header rows
    }, axes.x[0].map((_, iY) => {
        // iterate and expand the x axis
        return expand(axes.x, xSplits, xPoint => {
            // generate the x axis cells
            return axis(xPoint[iY], 'x');
            // generate the x/y header
        }, axes.y[0].map(() => axis({ key: '', value: '' }, 'xy')));
    }));
}
exports.split = split;
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
                next.source.push(...value.source);
                row.splice(iX, 1);
            }
            else if (onX && iX && (next = row[iX - 1]) && keyEquals(next, value) && next.rows === value.rows) {
                next.cols += value.cols;
                next.source.push(...value.source);
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
 * Compare two keys for equality
 * @hidden
 */
function keyEquals(a, b) {
    return a.text === b.text && a.style === b.style;
}
/**
 * Creates a cell within a table for a column or row heading.
 * @hidden
 */
function axis(pair, name) {
    return { text: pair.value, style: `axis ${name} ${pair.key}`, source: [], rows: 1, cols: 1 };
}
