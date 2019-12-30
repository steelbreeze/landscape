"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Detail_1 = require("./Detail");
var Cell_1 = require("./Cell");
var selectMany_1 = require("./selectMany");
/**
 * Prepares application data for rendering according to a selected set of axes.
 * @param applications The application data to prepare.
 * @param axes The axes to use.
 */
function getTable(applications, x, y) {
    // build the resultant table, a 3D array af rows (y), columns (x), and 0..n apps, including the x and y axis as row 0 and column 0 respectively
    var flattened = selectMany_1.selectMany(applications, function (app) { return app.usage; }, function (use, app) { return { detail: app.detail, xValue: use[x.name], yValue: use[y.name], status: use.status }; });
    var xAxis = __spreadArrays([[new Cell_1.Cell(Detail_1.noDetail(), "xAxis")]], x.values.map(function (xValue) { return [new Cell_1.Cell(Detail_1.noDetail("", xValue), "xAxis")]; }));
    var interim = __spreadArrays([xAxis], y.values.map(function (yValue) { return __spreadArrays([[new Cell_1.Cell(Detail_1.noDetail("", yValue), "yAxis")]], x.values.map(function (xValue) { return flattened.filter(function (app) { return app.xValue === xValue && app.yValue === yValue; }).map(function (app) { return new Cell_1.Cell(app.detail, app.status); }); })); }));
    var _loop_1 = function (iY) {
        // where there are no apps in a cells insert an empty cell object
        for (var iX = interim[iY].length; iX--;) {
            if (interim[iY][iX].length === 0) {
                interim[iY][iX].push(new Cell_1.Cell(Detail_1.noDetail(), "empty"));
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
    var mY = result.length, mX = result[0].length;
    for (var iY = mY; iY--;) {
        for (var iX = mX; iX--;) {
            var app = result[iY][iX];
            var merged = false;
            // try merge with cell above first
            if (!merged && iY) {
                var above = result[iY - 1][iX];
                if (above.detail.name === app.detail.name && above.style === app.style && above.colspan === app.colspan) {
                    above.rowspan += app.rowspan;
                    above.height += app.height;
                    result[iY].splice(iX, 1);
                    merged = true;
                }
            }
            // otherwise try cell to left
            if (!merged && iX) {
                var left = result[iY][iX - 1];
                if (left.detail.name === app.detail.name && left.style === app.style && left.rowspan === app.rowspan) {
                    left.colspan += app.colspan;
                    result[iY].splice(iX, 1);
                    merged = true;
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
