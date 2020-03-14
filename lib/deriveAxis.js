"use strict";
exports.__esModule = true;
/**
 * Extracts the list of unique values for a dimension from underlying application data.
 * @param applications The underlying application data.
 * @param x The name of the dimension to use as the x axis.
 * @param y The name of the dimension to use as the y axis.
 * @returns Returns an [IAxis] structure for hte
 */
function deriveAxes(applications, x, y) {
    var xValues = [];
    var yValues = [];
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var application = applications_1[_i];
        for (var _a = 0, _b = application.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            var xValue = use.dimensions[x];
            var yValue = use.dimensions[y];
            if (xValues.indexOf(xValue) === -1) {
                xValues.push(xValue);
            }
            if (yValues.indexOf(yValue) === -1) {
                yValues.push(yValue);
            }
        }
    }
    return { x: { name: x, values: xValues }, y: { name: y, values: yValues } };
}
exports.deriveAxes = deriveAxes;
