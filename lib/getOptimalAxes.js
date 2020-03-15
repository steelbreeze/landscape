"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
/**
 * Determine the optimum order of the x and y axes resulting in a layout with applications grouped together.
 * @param applications The raw application data
 * @param axes The x and y axes
 * @param axesSelector A function
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
function getOptimalAxes(applications, axes, axesSelector, xF, yF) {
    if (axesSelector === void 0) { axesSelector = function (scenarios) { return scenarios[0]; }; }
    if (xF === void 0) { xF = flexOrder; }
    if (yF === void 0) { yF = flexOrder; }
    var denormalised = denormalise(applications, axes);
    // retain only the scenarios with the best adjacency
    var scenarios = [];
    var bestAdjacency = -1;
    // iterate all X and Y using the formulas provided
    for (var _i = 0, _a = yF(axes.y); _i < _a.length; _i++) {
        var yValues = _a[_i];
        for (var _b = 0, _c = xF(axes.x); _b < _c.length; _b++) {
            var xValues = _c[_b];
            var adjacency = countAdjacency(denormalised, xValues, yValues, true, true);
            // just keep the best scenarios
            if (adjacency >= bestAdjacency) {
                // reset the best if needed
                if (adjacency > bestAdjacency) {
                    scenarios = [];
                    bestAdjacency = adjacency;
                }
                scenarios.push({ x: { name: axes.x.name, values: xValues }, y: { name: axes.y.name, values: yValues } });
            }
        }
    }
    return axesSelector(scenarios);
}
exports.getOptimalAxes = getOptimalAxes;
/**
 * Determine the a good order of the axes resulting in a layout with applications grouped together.
 * @param applications The raw application data
 * @param axes The x and y axes
 * @param axesSelector A function
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
function getGoodAxes(applications, axes, axesSelector, xF, yF) {
    if (axesSelector === void 0) { axesSelector = function (scenarios) { return scenarios[0]; }; }
    if (xF === void 0) { xF = flexOrder; }
    if (yF === void 0) { yF = flexOrder; }
    var denormalised = denormalise(applications, axes);
    // retain only the scenarios with the best adjacency
    var yScenarios = [];
    var xyScenarios = [];
    var bestAdjacency = -1;
    // iterate Y using the formulas provided with a constant X 
    for (var _i = 0, _a = yF(axes.y); _i < _a.length; _i++) {
        var yValues = _a[_i];
        var adjacency = countAdjacency(denormalised, axes.x.values, yValues, false, true);
        // just keep the best scenarios
        if (adjacency >= bestAdjacency) {
            // reset the best if needed
            if (adjacency > bestAdjacency) {
                yScenarios = [];
                bestAdjacency = adjacency;
            }
            yScenarios.push(yValues);
        }
    }
    // reset the best adjacency
    bestAdjacency = -1;
    // iterate all X and just the best Y using the formulas provided
    for (var _b = 0, yScenarios_1 = yScenarios; _b < yScenarios_1.length; _b++) {
        var yValues = yScenarios_1[_b];
        for (var _c = 0, _d = xF(axes.x); _c < _d.length; _c++) {
            var xValues = _d[_c];
            var adjacency = countAdjacency(denormalised, xValues, yValues, true, false);
            // just keep the best scenarios
            if (adjacency >= bestAdjacency) {
                // reset the best if needed
                if (adjacency > bestAdjacency) {
                    xyScenarios = [];
                    bestAdjacency = adjacency;
                }
                xyScenarios.push({ x: { name: axes.x.name, values: xValues }, y: { name: axes.y.name, values: yValues } });
            }
        }
    }
    return axesSelector(xyScenarios);
}
exports.getGoodAxes = getGoodAxes;
function denormalise(applications, axes) {
    var interim = [];
    var _loop_1 = function (app) {
        var _loop_2 = function (use) {
            var interimApp = interim.filter(function (a) { return a.detail.id === app.detail.id && a.status === use.status; })[0];
            if (!interimApp) {
                interimApp = { detail: app.detail, status: use.status, usage: [] };
                interim.push(interimApp);
            }
            interimApp.usage.push({ x: use.dimensions[axes.x.name], y: use.dimensions[axes.y.name] });
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
function countAdjacency(denormalised, xValues, yValues, countX, countY) {
    var adjacency = 0;
    var _loop_3 = function (app) {
        // create 2d boolean matrix where the application exists 
        var matrix = yValues.map(function (yValue) { return xValues.map(function (xValue) { return app.usage.some(function (use) { return use.y === yValue && use.x === xValue; }); }); });
        // count adjacent cells
        for (var iY = yValues.length; iY--;)
            for (var iX = xValues.length; iX--;) {
                if (matrix[iY][iX]) {
                    if (countY && iY && matrix[iY - 1][iX]) {
                        adjacency++;
                    }
                    if (countX && iX && matrix[iY][iX - 1]) {
                        adjacency++;
                    }
                }
            }
    };
    // test each application/status combination individually
    for (var _i = 0, denormalised_1 = denormalised; _i < denormalised_1.length; _i++) {
        var app = denormalised_1[_i];
        _loop_3(app);
    }
    return adjacency;
}
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
        result = [source];
    }
    else {
        source.forEach(function (exclude) {
            for (var _i = 0, _a = permutations(source.filter(function (element) { return element !== exclude; })); _i < _a.length; _i++) { // NOTE: we know we have unique values, so can compare the strings
                var excluded = _a[_i];
                result.push(__spreadArrays([exclude], excluded));
            }
        });
    }
    return result;
}
