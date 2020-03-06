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
 * @param flattened The flattened application data having previously been prepared by a call to [prepareData].
 * @param x The x axis to use.
 * @param y The y axis to use.
 */
function getTable(flattened, x, y) {
    // create the x-axis heading
    var result = [__spreadArrays([cell(heading(), "xAxis")], x.values.map(function (xValue) { return cell(heading(xValue), "xAxis"); }))];
    var _loop_1 = function (yValue) {
        // get the applications for each cells in the row; results in a jagged array
        var yApps = flattened.filter(function (app) { return app.yValue === yValue; });
        var row = x.values.map(function (xValue) { return yApps.filter(function (app) { return app.xValue === xValue; }); });
        // determine the number of rows each y axis value need to be expanded to
        var count = row.map(function (cell) { return cell.length || 1; });
        var split = count.reduce(leastCommonMultiple, 1);
        var _loop_2 = function (y_1) {
            // add the y-axis row heading and its applications
            result.push(__spreadArrays([cell(heading(yValue), "yAxis")], row.map(function (apps, x) {
                var app = apps[Math.floor(y_1 * count[x] / split)];
                return app ? cell(app.detail, app.status, split) : cell(heading(), "empty", split);
            })));
        };
        // add the rows to the resultant table
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
            if (iY && (adjacent = result[iY - 1][iX]) && (adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.cols === app.cols)) {
                // update the cell above to drop down into this cells space
                adjacent.rows += app.rows;
                adjacent.height += app.height;
                // remove this cell
                result[iY].splice(iX, 1);
            }
            // otherwise try cell to left
            else if (iX && (adjacent = result[iY][iX - 1]) && (adjacent.detail.name === app.detail.name && adjacent.style === app.style && adjacent.rows === app.rows)) {
                // update the cell left to spread across into this cells space
                adjacent.cols += app.cols;
                // remove this cell
                result[iY].splice(iX, 1);
            }
        }
    }
    return result;
}
exports.getTable = getTable;
/**
 * Creates a blank IDeail structure for x and y axis headings
 * @hidden
 */
function heading(name) {
    if (name === void 0) { name = ""; }
    return { id: "", name: name };
}
/**
 * Creates a cell for the output table
 * @hidden
 */
function cell(detail, style, split) {
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
