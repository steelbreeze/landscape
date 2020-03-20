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
 * Determine the a good order of the axes resulting in a layout with applications grouped together.
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
    var isXLong = axes.x.values.length > axes.y.values.length;
    var shortAxis = isXLong ? axes.y : axes.x;
    var longAxis = isXLong ? axes.x : axes.y;
    var denormalised = denormalise(applications, shortAxis, longAxis);
    var interimScenarios = [];
    var scenarios = [];
    var bestAdjacency = -1;
    // iterate permutations of the long axis, use the short axis as provided
    for (var _i = 0, _a = (isXLong ? xF : yF)(longAxis); _i < _a.length; _i++) {
        var longAxisValues = _a[_i];
        // count only adjacency along the long axis
        var adjacency = countAdjacency(denormalised, shortAxis.values, longAxisValues, false);
        // just keep the best scenarios
        if (adjacency >= bestAdjacency) {
            // reset the best if needed
            if (adjacency > bestAdjacency) {
                interimScenarios = [];
                bestAdjacency = adjacency;
            }
            interimScenarios.push(longAxisValues);
        }
    }
    // reset the best adjacency
    bestAdjacency = -1;
    // iterate just the best long axis results and iterate permutations of the short axis
    for (var _b = 0, interimScenarios_1 = interimScenarios; _b < interimScenarios_1.length; _b++) {
        var longAxisValues = interimScenarios_1[_b];
        for (var _c = 0, _d = (isXLong ? yF : xF)(shortAxis); _c < _d.length; _c++) {
            var shortAxisValues = _d[_c];
            // count only adjacency alony the short axis
            var adjacency = countAdjacency(denormalised, shortAxisValues, longAxisValues, true);
            // just keep the best scenarios
            if (adjacency >= bestAdjacency) {
                // reset the best if needed
                if (adjacency > bestAdjacency) {
                    scenarios = [];
                    bestAdjacency = adjacency;
                }
                scenarios.push(isXLong ? { y: { name: shortAxis.name, values: shortAxisValues }, x: { name: longAxis.name, values: longAxisValues } } : { x: { name: shortAxis.name, values: shortAxisValues }, y: { name: longAxis.name, values: longAxisValues } });
            }
        }
    }
    return axesSelector(scenarios);
}
exports.getOptimalAxes = getOptimalAxes;
/**
 * @hidden
 */
function denormalise(applications, x, y) {
    var interim = [];
    var _loop_1 = function (app) {
        var _loop_2 = function (use) {
            var interimApp = interim.filter(function (a) { return a.detail.id === app.detail.id && a.status === use.status; })[0];
            if (!interimApp) {
                interimApp = { detail: app.detail, status: use.status, usage: [] };
                interim.push(interimApp);
            }
            interimApp.usage.push({ x: use.dimensions[x.name], y: use.dimensions[y.name] });
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
/**
 * @hidden
 */
function countAdjacency(denormalised, xValues, yValues, countX) {
    var adjacency = 0;
    var _loop_3 = function (app) {
        // create 2d boolean matrix where the application exists 
        var matrix = yValues.map(function (y) { return xValues.map(function (x) { return app.usage.some(function (use) { return use.y === y && use.x === x; }); }); });
        // count adjacent cells on the x axis
        if (countX) {
            for (var iY = yValues.length; iY--;)
                for (var iX = xValues.length; --iX;) {
                    if (matrix[iY][iX] && matrix[iY][iX - 1]) {
                        adjacency++;
                    }
                }
        }
        // count adjacent cells on the y axis
        else {
            for (var iY = yValues.length; --iY;)
                for (var iX = xValues.length; iX--;) {
                    if (matrix[iY][iX] && matrix[iY - 1][iX]) {
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
