"use strict";
exports.__esModule = true;
/**
 * Returns the unique set of values within an application data set for a given dimension.
 * @param applications The applications data.
 * @param dimension The dimension to use as the y axis.
 * @returns Returns the axis with its values.
 */
function getAxis(applications, dimension) {
    var result = { name: dimension, values: [] };
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            var value = use[dimension];
            if (result.values.indexOf(value) === -1) {
                result.values.push(value);
            }
        }
    }
    return result;
}
exports.getAxis = getAxis;
