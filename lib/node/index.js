"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.table = void 0;
/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getElement A callback to generate an element containing the details used in table rendering,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param method A function used to calculate how many rows or columns to split a row/column into based on the number of entries in each cell of that row/column. Defaults to Math.max, but other methods such as Least Common Multiple can be used for more precise table rendering.
 */
const table = (cube, axes, getElement, onX, method = Math.max) => {
    // transform the cube of rows into a cube of cells
    const cells = cube.map(slice => slice.map(table => table.length ? transform(table, getElement) : [cell('empty')]));
    // calcuate the x splits required (y splits inlined below)
    const xSplits = axes.x.map((_, iX) => onX ? method(...cells.map(row => row[iX].length)) : 1);
    // generate the whole table
    return expand(cells, cells.map(row => onX ? 1 : method(...row.map(table => table.length))), 
    // generate x axis header rows
    axes.x[0].map((_, iC) => expand(axes.x, xSplits, 
    // generate the x/y header
    axes.y[0].map(() => cell('axis xy')), 
    // generate the x axis cells
    (x) => cell(`axis x ${x[iC].key}`, x[iC].value))), 
    // iterate and expand the x axis based on the split data
    (row, ySplit, ysi, iY) => expand(row, xSplits, 
    // generate the y axis row header cells
    axes.y[iY].map(criterion => cell(`axis y ${criterion.key}`, criterion.value)), 
    // generate the cube cells
    (cell, xSplit, xsi) => ({ ...cell[Math.floor(cell.length * (ysi + xsi) / (xSplit * ySplit))] })));
};
exports.table = table;
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
const merge = (cells, onX, onY) => {
    reverse(cells, (iY, row) => reverse(row, iX => onY && iY && mergeCells(cells[iY - 1][iX], 'cols', 'rows', row, iX) || onX && iX && mergeCells(row[iX - 1], 'rows', 'cols', row, iX)));
};
exports.merge = merge;
/**
 * Merge two adjacent cells if they are equivalent
 * @hidden
 */
const mergeCells = (next, compareKey, mergeKey, row, iX) => {
    let result = equals(next, row[iX], compareKey);
    if (result) {
        next[mergeKey] += row[iX][mergeKey];
        row.splice(iX, 1);
    }
    return result;
};
/**
 * Transform an array of rows into an array of cells.
 * @hidden
 */
const transform = (table, getElement) => {
    const result = [];
    table.forEach((row, index) => {
        const element = getElement(row, index, table);
        if (!result.some(cell => equals(cell, element))) {
            result.push({ ...element, rows: 1, cols: 1 });
        }
    });
    return result;
};
/**
 * Creates a cell within a table.
 * @hidden
 */
const cell = (style, value = '', key = '') => ({ key, value, style, rows: 1, cols: 1 });
/**
 * Expands an array using, splitting values into multiple based on a set of corresponding splits then maps the data to a desired structure.
 * @hidden
 */
const expand = (values, splits, seed, callbackfn) => {
    for (let length = values.length, iValue = 0; iValue < length; ++iValue) {
        for (let split = splits[iValue], iSplit = 0; iSplit < split; ++iSplit) {
            seed.push(callbackfn(values[iValue], split, iSplit, iValue));
        }
    }
    return seed;
};
/**
 * Compare two Elements for equality, using value, style and optionally, one other property.
 * @hidden
 */
const equals = (a, b, key) => a?.value === b.value && a.style === b.style && (!key || a[key] === b[key]);
/**
 * Reverse iterate an array.
 * @param hidden
 */
const reverse = (values, callback) => {
    for (let index = values.length; index--;) {
        callback(index, values[index]);
    }
};
