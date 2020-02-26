"use strict";
exports.__esModule = true;
/**
 * Denormalises the application data for a given x and y axis.
 * @param applications The application data to prepare.
 * @param x The x axis dimension to use.
 * @param y The y axis dimension to use.
 */
function prepareData(applications, x, y) {
    var denormalised = [];
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            denormalised.push({ detail: app.detail, xValue: use.dimensions[x], yValue: use.dimensions[y], commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
        }
    }
    return denormalised;
}
exports.prepareData = prepareData;
