"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.splitY = exports.splitX = void 0;
// constants used in a variety of places
const xyAxisCell = cell({ className: 'axis xy', text: '' });
const emptyKey = { className: 'empty', text: '' };
function splitX(filtered, yAxis, xAxis, getKey) {
    const splits = generate(xAxis.length, index => filtered.map(row => row[index].length || 1).reduce(leastCommonMultiple));
    const header = generate(xAxis[0].pairs.length, row => [...generate(yAxis[0].pairs.length, () => xyAxisCell), ...xAxis.reduce((res, c, index) => [...res, ...generate(splits[index], () => cell({ className: `axis x ${c.pairs[row].key}`, text: c.pairs[row].value }))], [])]);
    const mapped = filtered.map((row, ri) => [...yAxis[ri].pairs.map((pair) => cell({ className: `axis y ${pair.key}`, text: pair.value })), ...row.reduce((res, c, index) => [...res, ...generate(splits[index], nri => cell(c.length ? getKey(c[Math.floor(nri / splits[index] * c.length)]) : emptyKey))], [])]);
    return [...header, ...mapped];
}
exports.splitX = splitX;
function splitY(filtered, yAxis, xAxis, getKey) {
    const splits = filtered.map(row => row.map(cell => cell.length || 1).reduce(leastCommonMultiple));
    const header = generate(xAxis[0].pairs.length, row => [...generate(yAxis[0].pairs.length, () => xyAxisCell), ...xAxis.map(s => cell({ className: `axis x ${s.pairs[row].key}`, text: s.pairs[row].value }))]);
    const mapped = filtered.reduce((res, row, index) => [...res, ...generate(splits[index], nri => [...yAxis[index].pairs.map(pair => cell({ className: `axis y ${pair.key}`, text: pair.value })), ...row.map(rec => cell(rec.length ? getKey(rec[Math.floor(rec.length * nri / splits[index])]) : emptyKey))])], []);
    return [...header, ...mapped];
}
exports.splitY = splitY;
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
/**
 * Creates a cell within a table
 * @hidden
 */
function cell(key) {
    return Object.assign(Object.assign({}, key), { rowSpan: 1, colSpan: 1 });
}
