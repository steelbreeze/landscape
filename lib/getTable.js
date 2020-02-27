"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
/**
 * Prepares application data for rendering according to a selected set of axes.
 * @param applications The application data to prepare.
 * @param x The x axis to use.
 * @param y The y axis to use.
 */
function getTable(flattened, x, y) {
    // build the resultant table, a 3D array af rows (y), columns (x), and 0..n apps, including the x and y axis as row 0 and column 0 respectively
    var xAxis = __spreadArrays([[makeCell({ id: "", name: "" }, "xAxis")]], x.values.map(function (xValue) { return [makeCell({ id: "", name: xValue }, "xAxis")]; }));
    var interim = __spreadArrays([xAxis], y.values.map(function (yValue) { return __spreadArrays([[makeCell({ id: "", name: yValue }, "yAxis")]], x.values.map(function (xValue) { return flattened.filter(function (app) { return app.xValue === xValue && app.yValue === yValue; }).map(function (app) { return makeCell(app.detail, app.status); }); })); }));
    var _loop_1 = function (iY) {
        // where there are no apps in a cells insert an empty cell object
        for (var iX = interim[iY].length; iX--;) {
            if (interim[iY][iX].length === 0) {
                interim[iY][iX].push(makeCell({ id: "", name: "" }, "empty"));
            }
        }
        // where there are multiple apps in a cell, expand the rows
        var counts = interim[iY].map(function (cell) { return cell.length || 1; });
        var split = counts.reduce(leastCommonMultiple, 1);
        if (split > 1) {
            interim.splice.apply(interim, __spreadArrays([iY, 1], range(split).map(function (y) { return counts.map(function (c, x) { return interim[iY][x].length === 0 ? [] : [cloneCell(interim[iY][x][Math.floor(y / split * c)], split)]; }); })));
        }
    };
    // create blank apps and split rows as necessary
    for (var iY = interim.length; iY--;) {
        _loop_1(iY);
    }
    // create the final result structure
    var result = interim.map(function (row) { return row.map(function (col) { return col[0]; }); });
    var mY = result.length, mX = result[0].length;
    var app, adjacent;
    // merge adjacent cells
    for (var iY = mY; iY--;) {
        for (var iX = mX; iX--, app = result[iY][iX];) {
            // try merge with cell above first
            if (iY && (adjacent = result[iY - 1][iX]) && (adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.cols === app.cols)) {
                adjacent.rows += app.rows;
                adjacent.height += app.height;
                result[iY].splice(iX, 1);
            }
            // otherwise try cell to left
            else if (iX && (adjacent = result[iY][iX - 1]) && (adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.rows === app.rows)) {
                adjacent.cols += app.cols;
                result[iY].splice(iX, 1);
            }
        }
    }
    return result;
}
exports.getTable = getTable;
/**
 * Creates a cell for the output table
 * @hidden
 */
function makeCell(detail, style, colspan, rowspan, split) {
    if (colspan === void 0) { colspan = 1; }
    if (rowspan === void 0) { rowspan = 1; }
    if (split === void 0) { split = 1; }
    return { detail: detail, style: style, cols: colspan, rows: rowspan, height: 1 / split };
}
/**
 * Clones a cell for the output table
 * @hidden
 */
function cloneCell(cell, split) {
    return makeCell(cell.detail, cell.style, cell.cols, cell.rows, split);
}
/**
 * Returns an array of numbers from 0 to n -1
 * @param n
 * @hidden
 */
function range(n) {
    var result = [];
    for (var i = 0; i < n; ++i) {
        result.push(i);
    }
    return result;
}
/**
 * Returns the least common multiple of two integers
 * @param a
 * @param b
 * @hidden
 */
function leastCommonMultiple(a, b) {
    return (a * b) / greatestCommonFactor(a, b);
}
/**
 * Returns the greatest common factor of two numbers
 * @param a
 * @param b
 * @hidden
 */
function greatestCommonFactor(a, b) {
    return b ? greatestCommonFactor(b, a % b) : a;
}
