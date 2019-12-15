"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Cell_1 = require("./Cell");
/**
 * Prepares application data for rendering according to a selected set of axes.
 * @param applications The application data to prepare.
 * @param axes The axes to use.
 */
function getTable(applications, axes) {
    // denormalise the underlying application data
    var flattened = [];
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            flattened.push({ name: app.name, x: use[axes.xDimension], y: use[axes.yDimension], status: use.status });
        }
    }
    // build the resultant table, a 3D array af rows (y), columns (x), and 0..n apps, including the x and y axis as row 0 and column 0 respectively
    var xAxis = __spreadArrays([[new Cell_1.Cell("", "xAxis")]], axes.xValues.map(function (x) { return [new Cell_1.Cell(x, "xAxis")]; }));
    var interim = __spreadArrays([xAxis], axes.yValues.map(function (y) { return __spreadArrays([[new Cell_1.Cell(y, "yAxis")]], axes.xValues.map(function (x) { return flattened.filter(function (a) { return a.x === x && a.y === y; }).map(function (a) { return new Cell_1.Cell(a.name, a.status); }); })); }));
    var _loop_1 = function (iY) {
        // where there are no apps in a cells insert an empty cell object
        for (var iX = interim[iY].length; iX--;) {
            if (interim[iY][iX].length === 0) {
                interim[iY][iX].push(new Cell_1.Cell("", "empty"));
            }
        }
        // where there are multiple apps in a cell, expand the rows
        var counts = interim[iY].map(function (cell) { return cell.length || 1; });
        var split = counts.reduce(function (a, b) { return leastCommonMultiple(a, b); }, 1);
        if (split > 1) {
            interim.splice.apply(interim, __spreadArrays([iY, 1], range(split).map(function (y) { return counts.map(function (c, x) { return interim[iY][x].length === 0 ? [] : [interim[iY][x][Math.floor(y / split * c)].clone(split)]; }); })));
        }
    };
    // create blank apps and split rows as necessary
    for (var iY = interim.length; iY--;) {
        _loop_1(iY);
    }
    // create the final result structure
    var result = interim.map(function (row) { return row.map(function (col) { return col[0]; }); });
    // merge adjacent cells
    for (var iY = result.length; iY--;) {
        for (var iX = result[iY].length; iX--;) {
            var app = result[iY][iX];
            var merged = false;
            // try merge with cell above first
            if (!merged && iY) {
                var above = result[iY - 1][iX];
                if (above.name === app.name && above.style === app.style && above.colspan === app.colspan) {
                    above.rowspan += app.rowspan;
                    above.height += app.height;
                    result[iY].splice(iX, 1);
                    merged = true;
                }
            }
            // otherwise try cell to left
            if (!merged && iX) {
                var left = result[iY][iX - 1];
                if (left.name === app.name && left.style === app.style && left.rowspan === app.rowspan) {
                    left.colspan += app.colspan;
                    result[iY].splice(iX, 1);
                }
            }
        }
    }
    return result;
}
exports.getTable = getTable;
function range(n) {
    var result = [];
    for (var i = 0; i < n; ++i) {
        result.push(i);
    }
    return result;
}
function leastCommonMultiple(a, b) {
    return (a * b) / greatestCommonFactor(a, b);
}
function greatestCommonFactor(a, b) {
    return b ? greatestCommonFactor(b, a % b) : a;
}
