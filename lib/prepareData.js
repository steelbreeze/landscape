"use strict";
exports.__esModule = true;
/**
 * Denormalises the application data for a given x and y axis.
 * @param applications The application data to prepare.
 * @param x The x axis dimension to use.
 * @param y The y axis dimension to use.
 */
function prepareData(applications, x, y) {
    // TODO: refactor into a single iteration of x/y
    var denormalised = [];
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            denormalised.push({ detail: app.detail, xValue: use.dimensions[x.name], yValue: use.dimensions[y.name], commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
        }
    }
    // create a 2D table of y and x axis containing an array of all applications within each cell
    return y.values.map(function (yValue) { return x.values.map(function (xValue) { return denormalised.filter(function (app) { return app.yValue === yValue; }).filter(function (app) { return app.xValue === xValue; }); }); });
}
exports.prepareData = prepareData;
