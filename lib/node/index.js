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
    const identity = { index: 0 };
    // convert the source data to keys and remove resulting duplicates
    const cells = cube.map(row => row.map(table => table.length ? tableCells(table, getKey, identity) : [{ text: '', style: 'empty', index: [], source: [], rows: 1, cols: 1 }]));
    // create the resultant table
    return split(cells, axes, onX);
}
exports.table = table;
/**
 * Splits a cube of keys into a table, creating mutiple rows or columns where a cell in a cube has multiple values.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 */
function split(cells, axes, onX) {
    // calcuate the x and y splits required
    const xSplits = axes.x.map((_, iX) => onX ? leastCommonMultiple(cells, row => row[iX].length) : 1);
    const ySplits = cells.map(row => onX ? 1 : leastCommonMultiple(row, table => table.length));
    // iterate and expand the y axis based on the split data
    return expand(cells, ySplits, (row, ySplit, ysi, iY) => {
        // iterate and expand the x axis based on the split data
        return expand(row, xSplits, (cell, xSplit, xsi) => {
            // generate the cube cells
            return { ...cell[Math.floor(cell.length * (ysi + xsi) / (xSplit * ySplit))] };
            // generate the y axis row header cells
        }, axes.y[iY].map(criterion => axis(criterion.value, `axis y ${criterion.key}`)));
        // generate the x axis column header rows
    }, axes.x[0].map((_, iC) => {
        // iterate and expand the x axis
        return expand(axes.x, xSplits, x => {
            // generate the x axis cells
            return axis(x[iC].value, `axis x ${x[iC].key}`);
            // generate the x/y header
        }, axes.y[0].map(() => axis('', 'axis xy')));
    }));
}
exports.split = split;
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
function merge(cells, onX, onY) {
    let next;
    forEachRev(cells, (row, iY) => {
        forEachRev(row, (cell, iX) => {
            if (onY && iY && (next = cells[iY - 1][iX]) && keyEquals(next, cell) && next.cols === cell.cols) {
                next.rows += cell.rows;
                mergeContext(next, cell);
                row.splice(iX, 1);
            }
            else if (onX && iX && (next = row[iX - 1]) && keyEquals(next, cell) && next.rows === cell.rows) {
                next.cols += cell.cols;
                mergeContext(next, cell);
                row.splice(iX, 1);
            }
        });
    });
}
exports.merge = merge;
/**
 * Merges the context of two adjacent cells.
 * @hidden
 */
function mergeContext(next, cell) {
    cell.index.forEach((index, i) => {
        if (!next.index.includes(index)) {
            next.index.push(index);
            next.source.push(cell.source[i]);
        }
    });
}
/**
 * Convert a table of rows into a table of cells.
 * @hidden
 */
function tableCells(table, getKey, identity) {
    const result = [];
    for (const row of table) {
        const key = getKey(row);
        const cell = result.find(cell => keyEquals(cell, key));
        if (cell) {
            cell.index.push(identity.index);
            cell.source.push(row);
        }
        else {
            result.push({ ...key, index: [identity.index], source: [row], rows: 1, cols: 1 });
        }
        identity.index++;
    }
    return result;
}
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
function axis(text, style) {
    return { text, style, index: [], source: [], rows: 1, cols: 1 };
}
