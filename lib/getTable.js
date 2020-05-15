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
 * @param applications The structured application data having previously been prepared by a call to [prepareData].
 * @param axes The x and y axis.
 */
function getTable(applications, axes) {
    // determine the number of rows and columns each cell need to be split into
    var appCounts = applications.map(function (row) { return row.map(function (cell) { return cell.length || 1; }); });
    var rowSplits = appCounts.map(function (row) { return row.reduce(leastCommonMultiple, 1); });
    //	const colSplits = appCounts[0].map((col, i) => appCounts.map(row => row[i]).reduce(leastCommonMultiple, 1));
    // create the x-axis heading
    var result = [__spreadArrays([cell({ id: "", name: "" }, "xAxis")], axes.x.values.map(function (xValue) { return cell({ id: "", name: xValue }, "xAxis"); }))];
    // create the rows in the result table
    applications.forEach(function (row, rowIndex) {
        var _loop_1 = function (rowSplitIndex) {
            // add the y-axis row heading and its applications
            result.push(__spreadArrays([cell({ id: "", name: axes.y.values[rowIndex] }, "yAxis")], row.map(function (apps, columnIndex) {
                var app = apps[Math.floor(rowSplitIndex * appCounts[rowIndex][columnIndex] / rowSplits[rowIndex])];
                return app ? cell(app.detail, app.status, rowSplits[rowIndex]) : cell({ id: "", name: "" }, "empty", rowSplits[rowIndex]);
            })));
        };
        // add the rows to the resultant table
        for (var rowSplitIndex = rowSplits[rowIndex]; rowSplitIndex--;) {
            _loop_1(rowSplitIndex);
        }
    });
    // merge adjacent cells
    var app, adjacent;
    // iterate through the cells, from the bottom right to top left
    for (var iY = result.length; iY--;) {
        for (var iX = result[iY].length; iX--;) {
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
 * Creates a cell for the output table
 * @hidden
 */
function cell(detail, style, rowSplit, colSplit) {
    if (rowSplit === void 0) { rowSplit = 1; }
    if (colSplit === void 0) { colSplit = 1; }
    return { detail: detail, style: style, cols: 1, rows: 1, height: 1 / rowSplit, width: 1 / colSplit };
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
