"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leastCommonMultiple = exports.merge = exports.table = exports.setMode = void 0;
/**
 * The formula used to calculate the number of cells to split a row or column into.
 * @hidden
 */
let mode = Math.max;
function setMode(value) {
    mode = value;
}
exports.setMode = setMode;
/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getElement A callback to generate an element containing the details used in table rendering,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param precise A flag to control the method that cells are split; set to true to yeild an even number of splits for rows/columns.
 */
function table(cube, axes, getElement, onX) {
    // convert the source data to cells and remove resulting duplicates; create the resultant table
    return expand(cube.map(row => row.map(table => table.length ? cells(table, getElement) : [cell(element('empty'))])), axes, onX);
}
exports.table = table;
/**
 * Expands a cube of cells into a table, creating mutiple rows or columns where a cell in a cube has multiple values.
 * @hidden
 */
function expand(cells, axes, onX) {
    // calcuate the x and y splits required
    const xSplits = axes.x.map((_, iX) => onX ? split(cells, row => row[iX].length) : 1);
    const ySplits = cells.map(row => onX ? 1 : split(row, table => table.length));
    // iterate and expand the y axis based on the split data
    return reduce(cells, ySplits, (row, ySplit, ysi, iY) => 
    // iterate and expand the x axis based on the split data
    reduce(row, xSplits, (cell, xSplit, xsi) => 
    // generate the cube cells
    ({ ...cell[Math.floor(cell.length * (ysi + xsi) / (xSplit * ySplit))] }), 
    // generate the y axis row header cells
    axes.y[iY].map(criterion => cell(element(`axis y ${criterion.key}`, criterion.value)))), 
    // generate the x axis column header rows
    axes.x[0].map((_, iC) => 
    // iterate and expand the x axis
    reduce(axes.x, xSplits, x => 
    // generate the x axis cells
    cell(element(`axis x ${x[iC].key}`, x[iC].value)), 
    // generate the x/y header
    axes.y[0].map(() => cell(element('axis xy'))))));
}
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
const merge = (cells, onX, onY) => {
    let next;
    forEachRev(cells, (row, iY) => {
        forEachRev(row, (cell, iX) => {
            if (onY && iY && (next = cells[iY - 1][iX]) && equals(next, cell) && next.cols === cell.cols) {
                next.rows += cell.rows;
                row.splice(iX, 1);
            }
            else if (onX && iX && (next = row[iX - 1]) && equals(next, cell) && next.rows === cell.rows) {
                next.cols += cell.cols;
                row.splice(iX, 1);
            }
        });
    });
};
exports.merge = merge;
/**
 * Convert a table of rows into a table of cells.
 * @hidden
 */
function cells(table, getElement) {
    const result = [];
    for (const row of table) {
        const element = getElement(row);
        if (!result.some(cell => equals(cell, element))) {
            result.push(cell(element));
        }
    }
    return result;
}
/**
 * Calculate the number of splits required for a given cell
 * @hidden
 */
const split = (source, callbackfn) => mode(...source.map(item => callbackfn(item) || 1));
/**
 * Expands an array using, splitting values into multiple based on a set of corresponding splits then maps the data to a desired structure.
 * @hidden
 */
function reduce(values, splits, callbackfn, seed) {
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
const forEachRev = (values, callbackfn) => {
    for (let index = values.length; index--;) {
        callbackfn(values[index], index);
    }
};
/**
 * Returns the least common multiple of a set of integers generated from an object.
 * @hidden
 */
const leastCommonMultiple = (...counts) => counts.reduce((a, b) => (a * b) / greatestCommonFactor(a, b));
exports.leastCommonMultiple = leastCommonMultiple;
/**
 * Returns the greatest common factor of two numbers
 * @hidden
 */
const greatestCommonFactor = (a, b) => b ? greatestCommonFactor(b, a % b) : a;
/**
 * Compare two Elements for equality
 * @hidden
 */
const equals = (a, b) => a.key === b.key && a.value === b.value && a.style === b.style;
/**
 * Creates a Element.
 * @hidden
 */
const element = (style, value = '', key = '') => ({ key, value, style });
/**
 * Creates a cell within a table.
 * @hidden
 */
const cell = (key) => ({ ...key, rows: 1, cols: 1 });
