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
    // denormalise and position each application within the correct table cell
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            var yIndex = axes.y.values.indexOf(use.dimensions[axes.y.name]), xIndex = axes.x.values.indexOf(use.dimensions[axes.x.name]);
            if (yIndex !== -1 && xIndex !== -1) {
                result[yIndex][xIndex].push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
            }
        }
    }
    // TODO: consider the order of applications within a cell to promote merges in getTable
    return result;
}
exports.prepareData = prepareData;
/**
 * Structures and denormalises the application data aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param axes The chosen x and y axis.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
function prepareData3(applications, axes) {
    // create the empty destination table structure
    var result = axes.x.values.map(function () { return axes.y.values.map(function () { return []; }); });
    // denormalise and position each application within the correct table cell
    for (var _i = 0, applications_2 = applications; _i < applications_2.length; _i++) {
        var app = applications_2[_i];
        for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            var yIndex = axes.y.values.indexOf(use.dimensions[axes.y.name]), xIndex = axes.x.values.indexOf(use.dimensions[axes.x.name]);
            if (yIndex !== -1 && xIndex !== -1) {
                result[xIndex][yIndex].push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
            }
        }
    }
    // TODO: consider the order of applications within a cell to promote merges in getTable
    return result;
}
exports.prepareData3 = prepareData3;
