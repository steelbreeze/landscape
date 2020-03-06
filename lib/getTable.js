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
    // create the rows in the result table
    flattened.forEach(function (row, i) {
        // determine the number of rows each y axis value need to be expanded to
        var count = row.map(function (cell) { return cell.length || 1; });
        var split = count.reduce(leastCommonMultiple, 1);
        var _loop_1 = function (si) {
            // add the y-axis row heading and its applications
            result.push(__spreadArrays([cell(heading(y.values[i]), "yAxis")], row.map(function (apps, x) {
                var app = apps[Math.floor(si * count[x] / split)];
                return app ? cell(app.detail, app.status, split) : cell(heading(), "empty", split);
            })));
        };
        // add the rows to the resultant table
        for (var si = 0; si < split; si++) {
            _loop_1(si);
        }
    });
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
