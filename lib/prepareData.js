"use strict";
exports.__esModule = true;
/**
 * Structures and denormalises the application aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
function prepareData(applications, x, y) {
    return y.values.map(function (yValue) {
        var appsInRow = applications.filter(function (app) { return app.usage.some(function (use) { return use.dimensions[y.name] === yValue; }); });
        return x.values.map(function (xValue) {
            var appsInCell = appsInRow.filter(function (app) { return app.usage.some(function (use) { return use.dimensions[x.name] === xValue; }); });
            var cell = [];
            for (var _i = 0, appsInCell_1 = appsInCell; _i < appsInCell_1.length; _i++) {
                var app = appsInCell_1[_i];
                for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
                    var use = _b[_a];
                    if (use.dimensions[y.name] === yValue && use.dimensions[x.name] === xValue) {
                        cell.push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
                    }
                }
            }
            return cell;
        });
    });
}
exports.prepareData = prepareData;
