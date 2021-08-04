"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitOnY = exports.splitOnX = exports.getTable = void 0;
/**
 * Create a table from a cube, merging the axes and cube query result
 */
function getTable(cube, y, x, key) {
    const result = [];
    // add the top-rows
    for (let iC = 0; iC < x[0].pairs.length; iC++) {
        result.push([...y[0].pairs.map(() => cell({ className: "xy axis", text: "" })), ...x.map(p => cell({ className: `x axis ${p.pairs[iC].key}`, text: String(p.pairs[iC].value) }))]);
    }
    // add the data rows and column headings
    for (let iR = 0; iR < cube.length; iR++) {
        result.push([...y[iR].pairs.map(c => cell({ className: `y axis ${c.key}`, text: String(c.value) })), ...cube[iR].map(c => c.length ? cell(key(c[0])) : cell({ className: "empty", text: "" }))]);
    }
    return result;
}
exports.getTable = getTable;
/**
 * Creates a cell within a table
 */
function cell(key) {
    return { className: key.className, text: key.text, rowSpan: 1, colSpan: 1 };
}
/**
 * Creates multiple columns in a cube where a cell had multiple entries in it.
 * @param cube The source cube to split up.
 */
function splitOnX(cube, x) {
    // count the number of results in each cell
    const splits = cube[0].map((_c, ci) => cube.map(row => row[ci].length || 1).reduce(leastCommonMultiple));
    for (let index = splits.length; index--;) {
        const split = splits[index];
        if (split > 1) {
            cube.forEach(row => {
                const c = row[index];
                row.splice(index, 1, ...generate(split, nri => c.length ? [c[Math.floor(nri * c.length / split)]] : []));
            });
            x.splice(index, 1, ...generate(split, () => x[index]));
        }
    }
}
exports.splitOnX = splitOnX;
/**
 * Creates multiple rows in a cube where a cell had multiple entries in it.
 */
function splitOnY(cube, y) {
    // determine the least common multiple per row based on the number of items within a cell
    const splits = cube.map(row => row.map(cell => cell.length || 1).reduce(leastCommonMultiple));
    // as we're adjusting the overall length of the source, we iterate in reverse
    for (let index = splits.length; index--;) {
        const split = splits[index];
        if (split > 1) {
            cube.splice(index, 1, ...generate(split, nri => cube[index].map(c => c ? [c[Math.floor(nri * c.length / split)]] : [])));
            y.splice(index, 1, ...generate(split, () => y[index]));
        }
    }
}
exports.splitOnY = splitOnY;
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
