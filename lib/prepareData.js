"use strict";
exports.__esModule = true;
/**
 * Structures and denormalises the application data aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param axes The chosen x and y axis.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
function prepareData(applications, axes) {
    // create the empty destination table structure
    var result = axes.y.values.map(function () { return axes.x.values.map(function () { return []; }); });
    var _loop_1 = function (app) {
        var _loop_2 = function (use) {
            var yIndex = axes.y.values.indexOf(use.dimensions[axes.y.name]);
            var xIndex = axes.x.values.indexOf(use.dimensions[axes.x.name]);
            // only add the app / use combination if there is a cell in the target table and the app/status combination is unique within that cell
            if (yIndex !== -1 && xIndex !== -1 && !result[yIndex][xIndex].some(function (da) { return da.detail.id === app.detail.id && da.status === use.status; })) {
                result[yIndex][xIndex].push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
            }
        };
        for (var _i = 0, _a = app.usage; _i < _a.length; _i++) {
            var use = _a[_i];
            _loop_2(use);
        }
    };
    // denormalise and position each application within the correct table cell
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        _loop_1(app);
    }
    return result;
}
exports.prepareData = prepareData;
