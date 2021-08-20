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
    const xSplits = xAxis.map((_, xIndex) => onX ? cube.map(row => row[xIndex].length || 1).reduce(leastCommonMultiple) : 1);
    const ySplits = cube.map(row => row.map(table => onX ? 1 : table.length || 1).reduce(leastCommonMultiple));
    // iterate and expand the y axis
    return expand(cube, ySplits, (row, ySplit, ysi, yIndex) => {
        // iterate and expand the x axis
        return expand(row, xSplits, (values, xSplit, xsi) => {
            // generate data cell
            return cell(values.length ? getKey(values[Math.floor(values.length * (ysi + xsi) / (xSplit * ySplit))]) : { text: '', className: 'empty' });
            // generate the y axis header cells
        }, yAxis[yIndex].data.map(pair => axis(pair, 'y')));
    }, 
    // generate the x axis header rows
    xAxis[0].data.map((_, yIndex) => {
        // generate an x header row
        return expand(xAxis, xSplits, xPoint => {
            // generate an x header row cell
            return axis(xPoint.data[yIndex], 'x');
            // create the x/y header cells
        }, yAxis[0].data.map(() => axis({ key: '', value: '' }, 'xy')));
    }));
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
    for (let iY = table.length; iY--;) {
        const row = table[iY];
        for (let iX = row.length; iX--;) {
            const cell = row[iX];
            if (onY && iY && (next = table[iY - 1][iX]) && next.text === cell.text && next.className === cell.className && next.colSpan === cell.colSpan) {
                next.rowSpan += cell.rowSpan;
                row.splice(iX, 1);
            }
            else if (onX && iX && (next = row[iX - 1]) && next.text === cell.text && next.className === cell.className && next.rowSpan === cell.rowSpan) {
                next.colSpan += cell.colSpan;
                row.splice(iX, 1);
            }
        }
    }
}
exports.merge = merge;
/**
 * Expands an array using, splitting values into multiple based on a set of corresponding splits then maps the data to a desired structure.
 * @hidden
 */
function expand(values, splits, f, seed) {
    values.forEach((value, valueIndex) => {
        const split = splits[valueIndex];
        for (let splitIndex = 0; splitIndex < split; ++splitIndex) {
            seed.push(f(value, split, splitIndex, valueIndex));
        }
    });
    return seed;
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
/**
 * Creates a cell within a table for a column or row heading.
 * @hidden
 */
function axis(pair, name) {
    return cell({ text: pair.value, className: `axis ${name} ${pair.key}` });
}
