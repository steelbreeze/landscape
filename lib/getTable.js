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
    var empty = Cell({ id: "", name: "" }, "empty");
    // create the x-axis heading
    var result = [__spreadArrays([Cell({ id: "", name: "" }, "xAxis")], x.values.map(function (xValue) { return Cell({ id: "", name: xValue }, "xAxis"); }))];
    var _loop_1 = function (yValue) {
        // get the applications for each cells in the row; default if none found
        var yApps = flattened.filter(function (app) { return app.yValue === yValue; });
        var row = x.values.map(function (xValue) { var cells = yApps.filter(function (app) { return app.xValue === xValue; }).map(function (app) { return Cell(app.detail, app.status); }); return cells.length ? cells : [empty]; });
        // TODO: keep row as just apps and convert when adding rows?
        // determine the number of rows each row need to be expanded to based on the application count per cell
        var cellCounts = row.map(function (cell) { return cell.length; });
        var split = cellCounts.reduce(leastCommonMultiple, 1);
        var _loop_2 = function (y_1) {
            result.push(__spreadArrays([Cell({ id: "", name: yValue }, "yAxis")], row.map(function (cell, x) { var app = cell[Math.floor(y_1 / split * cellCounts[x])]; return Cell(app.detail, app.style, split); })));
        };
        // expand the rows as needed
        for (var y_1 = 0; y_1 < split; y_1++) {
            _loop_2(y_1);
        }
    };
    // create the rows
    for (var _i = 0, _a = y.values; _i < _a.length; _i++) {
        var yValue = _a[_i];
        _loop_1(yValue);
    }
    // merge adjacent cells
    var mY = result.length, mX = result[0].length;
    var app, adjacent;
    // iterate through the cells, from the bottom right to top left
    for (var iY = mY; iY--;) {
        for (var iX = mX; iX--;) {
            app = result[iY][iX];
            // try merge with cell above first
            if (iY && (adjacent = result[iY - 1][iX]) &&
                (adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.cols === app.cols)) {
                adjacent.rows += app.rows;
                adjacent.height += app.height;
                result[iY].splice(iX, 1);
            }
            // otherwise try cell to left
            else if (iX && (adjacent = result[iY][iX - 1]) &&
                (adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.rows === app.rows)) {
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
function Cell(detail, style, split) {
    if (split === void 0) { split = 1; }
    return { detail: detail, style: style, cols: 1, rows: 1, height: 1 / split };
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
