"use strict";
exports.__esModule = true;
/**
 * Returns the x and y axes for a given data set.
 * @param applications The applications data.
 * @param xDimension The dimension to use as the x axis.
 * @param yDimension The dimension to use as the y axis.
 * @returns Returns the x and y axes with their values.
 */
function getAxes(applications, xDimension, yDimension) {
    var xValues = [];
    var yValues = [];
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            var xValue = use[xDimension];
            var yValue = use[yDimension];
            if (xValues.indexOf(xValue) === -1) {
                xValues.push(xValue);
            }
            if (yValues.indexOf(yValue) === -1) {
                yValues.push(yValue);
            }
        }
    }
    return { xDimension: xDimension, xValues: xValues, yDimension: yDimension, yValues: yValues };
}
exports.getAxes = getAxes;
