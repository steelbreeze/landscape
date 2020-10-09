"use strict";
exports.__esModule = true;
exports.prepareData = void 0;
/**
 * Structures and denormalises the application data aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @param getKey A callback to create a unique key for the reduction of applications into the cells.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
function prepareData(applications, x, y, getKey) {
    var result = y.values.map(function () { return x.values.map(function () { return []; }); });
    // denormalise and position each application within the correct table cell
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        var _loop_1 = function (use) {
            var key = getKey(app.detail, use);
            var yIndex = y.values.indexOf(use.dimensions[y.name]);
            var xIndex = x.values.indexOf(use.dimensions[x.name]);
            // only add the app / use combination if there is a cell if the key is not already there
            if (yIndex !== -1 && xIndex !== -1 && !result[yIndex][xIndex].some(function (da) { return da.key.major === key.major && da.key.minor === key.minor; })) {
                result[yIndex][xIndex].push({ key: key, detail: app.detail, dimensions: use.dimensions, commissioned: use.commissioned, decommissioned: use.decommissioned });
            }
        };
        for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            _loop_1(use);
        }
    }
    return result;
}
exports.prepareData = prepareData;
