"use strict";
exports.__esModule = true;
/**
 * Denormalises the application data for a given x and y axis.
 * @param applications The application data to prepare.
 * @param x The x axis dimension to use.
 * @param y The y axis dimension to use.
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
