"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
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
    var denormalised = flatten(applications, x.name, y.name);
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
                scenarios.push({ x: { name: x.name, values: xValues }, y: { name: y.name, values: yValues } });
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
    return permutations(axis.values);
}
exports.flexOrder = flexOrder;
/**
 * Returns all possible orderings of an array
 * @hidden
 */
function permutations(source) {
    var result = [];
    if (source.length === 1) {
        result.push(source);
    }
    else {
        source.forEach(function (exclude, excludeIndex) {
            for (var _i = 0, _a = permutations(source.filter(function (element, elementIndex) { return elementIndex !== excludeIndex; })); _i < _a.length; _i++) {
                var excluded = _a[_i];
                result.push(__spreadArrays([exclude], excluded));
            }
        });
    }
    return result;
}
/**
 * Denormalise the application data into an intermedia
 * @param applications
 * @param x
 * @param y
 * @hidden
 */
function flatten(applications, x, y) {
    // denormalise the underlying application data and resolve the axes
    var interim = [];
    var _loop_1 = function (app) {
        var _loop_2 = function (use) {
            var interimApp = interim.filter(function (a) { return a.detail.id === app.detail.id && a.status === use.status; })[0];
            if (!interimApp) {
                interimApp = { detail: app.detail, status: use.status, usage: [] };
                interim.push(interimApp);
            }
            interimApp.usage.push({ x: use.dimensions[x], y: use.dimensions[y] });
        };
        for (var _i = 0, _a = app.usage; _i < _a.length; _i++) {
            var use = _a[_i];
            _loop_2(use);
        }
    };
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        _loop_1(app);
    }
    // delete single use app/status combinations as they cannot contribute to affinity score
    return interim.filter(function (app) { return app.usage.length > 1; });
}
