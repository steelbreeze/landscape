"use strict";
exports.__esModule = true;
var Axis_1 = require("./Axis");
var Axes_1 = require("./Axes");
var flatten_1 = require("./flatten");
var permutations_1 = require("./permutations");
var getAdjacency_1 = require("./getAdjacency");
/**
 * Determine the optimum order of the axes resulting in a layout with applications grouped together
 * @param applications The raw application data
 * @param x The x axis
 * @param y The y axis
 * @param axesSelector A function
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
function getOptimalAxes(applications, x, y, axesSelector, xF, yF) {
    if (axesSelector === void 0) { axesSelector = function (scenarios) { return scenarios[0]; }; }
    if (xF === void 0) { xF = flexOrder; }
    if (yF === void 0) { yF = flexOrder; }
    // denormalise the underlying application data and resolve the axes
    var denormalised = flatten_1.flatten(applications, x, y);
    // some items not to recalculate in an O(n!) algo
    var xPerms = xF(x);
    var yPerms = yF(y);
    // retain only the scenarios with the best adjacency
    var scenarios = [];
    var bestAdjacency = -1;
    // iterate all X and Y using the formulas provided
    for (var _i = 0, yPerms_1 = yPerms; _i < yPerms_1.length; _i++) {
        var yValues = yPerms_1[_i];
        for (var _a = 0, xPerms_1 = xPerms; _a < xPerms_1.length; _a++) {
            var xValues = xPerms_1[_a];
            var adjacency = getAdjacency_1.getAdjacency(denormalised, xValues, yValues);
            // just keep the best scenarios
            if (adjacency >= bestAdjacency) {
                if (adjacency > bestAdjacency) {
                    scenarios = [];
                    bestAdjacency = adjacency;
                }
                scenarios.push(new Axes_1.Axes(new Axis_1.Axis(x.name, xValues), new Axis_1.Axis(y.name, yValues)));
            }
        }
    }
    return axesSelector(scenarios);
}
exports.getOptimalAxes = getOptimalAxes;
/**
 * Allow an axis to be assessed in any order of the axis values.
 * @param axis The axis to flex
 * @hidden
 */
function flexOrder(axis) {
    return permutations_1.permutations(axis.values);
}
exports.flexOrder = flexOrder;
