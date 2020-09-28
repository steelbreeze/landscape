"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.getTable = void 0;
/**
 * Prepares application data for rendering according to a selected set of axes.
 * @param applications The structured application data having previously been prepared by a call to [prepareData].
 * @param axes The x and y axis.
 */
function getTable(applications, axes, splitOnY, key) {
    if (splitOnY === void 0) { splitOnY = true; }
    if (key === void 0) { key = "name"; }
    var result = [];
    // determine the number of rows and columns each cell need to be split into
    var appCounts = applications.map(function (row) { return row.map(function (cell) { return cell.length || 1; }); });
    // create the top row heading
    var topRow = __spreadArrays([cell(detail(key, ""), "xyAxis")], axes.x.values.map(function (xValue) { return cell(detail(key, xValue), "xAxis"); }));
    if (splitOnY) {
        var rowSplits_1 = appCounts.map(function (row) { return row.reduce(leastCommonMultiple, 1); });
        result.push(topRow);
        // create the rows in the result table
        applications.forEach(function (row, rowIndex) {
            var _loop_1 = function (rowSplitIndex) {
                // add the y-axis row heading and its applications
                result.push(__spreadArrays([cell(detail(key, axes.y.values[rowIndex]), "yAxis")], row.map(function (apps, columnIndex) {
                    var app = apps[Math.floor(rowSplitIndex * appCounts[rowIndex][columnIndex] / rowSplits_1[rowIndex])];
                    return app ? cell(app.detail, app.status, rowSplits_1[rowIndex], 1) : cell(detail(key, ""), "empty", rowSplits_1[rowIndex], 1);
                })));
            };
            // add the rows to the resultant table
            for (var rowSplitIndex = rowSplits_1[rowIndex]; rowSplitIndex--;) {
                _loop_1(rowSplitIndex);
            }
        });
    }
    else {
        var colSplits_1 = __spreadArrays([1], appCounts[0].map(function (col, i) { return appCounts.map(function (row) { return row[i]; }).reduce(leastCommonMultiple, 1); }));
        var rr_1 = [];
        topRow.forEach(function (app, index) {
            for (var i = 0; i < colSplits_1[index]; i++) {
                rr_1.push(cell(app.detail, app.style, 1, colSplits_1[index]));
            }
        });
        result.push(rr_1);
        applications.forEach(function (row, rowIndex) {
            var rr = [cell(detail(key, axes.y.values[rowIndex]), "yAxis")];
            row.forEach(function (apps, colIndex) {
                for (var i = 0; i < colSplits_1[colIndex + 1]; i++) {
                    var app_1 = apps[Math.floor(i * appCounts[rowIndex][colIndex] / colSplits_1[colIndex + 1])];
                    rr.push(app_1 ? cell(app_1.detail, app_1.status, 1, colSplits_1[colIndex + 1]) : cell(detail(key, ""), "empty", 1, colSplits_1[colIndex + 1]));
                }
            });
            result.push(rr);
        });
    }
    // merge adjacent cells
    var app, adjacent;
    // iterate through the cells, from the bottom right to top left
    for (var iY = result.length; iY--;) {
        for (var iX = result[iY].length; iX--;) {
            app = result[iY][iX];
            // try merge with cell above first
            if (iY && (adjacent = result[iY - 1][iX]) && (adjacent.detail[key] === app.detail[key] && adjacent.style === app.style && adjacent.cols === app.cols)) {
                // update the cell above to drop down into this cells space
                adjacent.rows += app.rows;
                adjacent.height += app.height;
                // remove this cell
                result[iY].splice(iX, 1);
            }
            // otherwise try cell to left
            else if (iX && (adjacent = result[iY][iX - 1]) && (adjacent.detail[key] === app.detail[key] && adjacent.style === app.style && adjacent.rows === app.rows)) {
                // update the cell left to spread across into this cells space
                adjacent.cols += app.cols;
                adjacent.width += app.width;
                // remove this cell
                result[iY].splice(iX, 1);
            }
        }
    }
    return result;
}
exports.getTable = getTable;
/**
 * Creates a dummy detail record for the creation of
 * @param key
 * @param value
 */
function detail(key, value) {
    var result = {};
    result[key] = value;
    return result;
}
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
