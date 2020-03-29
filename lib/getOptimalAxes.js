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
    var interimScenarios = [];
    var scenarios = [];
    var bestAdjacency = -1;
    // denormalise the data
    var denormalised = applications.reduce(function (result, app) {
        var interim = [];
        var _loop_3 = function (use) {
            var denormalisedApp = interim.filter(function (a) { return a.status === use.status; })[0];
            if (!denormalisedApp) {
                denormalisedApp = { detail: app.detail, status: use.status, usage: [] };
                interim.push(denormalisedApp);
            }
            denormalisedApp.usage.push({ x: use.dimensions[shortAxis.name], y: use.dimensions[longAxis.name] });
        };
        for (var _i = 0, _a = app.usage; _i < _a.length; _i++) {
            var use = _a[_i];
            _loop_3(use);
        }
        return result.concat.apply(result, interim.filter(function (app) { return app.usage.length > 1; }));
    }, []);
    // iterate permutations of the long axis, use the short axis as provided
    for (var _i = 0, _a = (isXLong ? xF : yF)(longAxis); _i < _a.length; _i++) {
        var longAxisValues = _a[_i];
        // count only adjacency along the long axis
        var adjacency = 0;
        var _loop_1 = function (app) {
            // create 2d boolean matrix where the application exists 
            var matrix = longAxisValues.map(function (y) { return shortAxis.values.map(function (x) { return app.usage.some(function (use) { return use.y === y && use.x === x; }); }); });
            for (var iL = longAxisValues.length; --iL;)
                for (var iS = shortAxis.values.length; iS--;) {
                    if (matrix[iL][iS] && matrix[iL - 1][iS]) {
                        adjacency++;
                    }
                }
        };
        // test each application/status combination individually
        for (var _b = 0, denormalised_1 = denormalised; _b < denormalised_1.length; _b++) {
            var app = denormalised_1[_b];
            _loop_1(app);
        }
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
    for (var _c = 0, interimScenarios_1 = interimScenarios; _c < interimScenarios_1.length; _c++) {
        var longAxisValues = interimScenarios_1[_c];
        var _loop_2 = function (shortAxisValues) {
            // count only adjacency alony the short axis
            var adjacency = 0;
            var _loop_4 = function (app) {
                // create 2d boolean matrix where the application exists 
                var matrix = longAxisValues.map(function (y) { return shortAxisValues.map(function (x) { return app.usage.some(function (use) { return use.y === y && use.x === x; }); }); });
                // count adjacent cells on the x axis
                for (var iL = longAxisValues.length; iL--;)
                    for (var iS = shortAxisValues.length; --iS;) {
                        if (matrix[iL][iS] && matrix[iL][iS - 1]) {
                            adjacency++;
                        }
                    }
            };
            // test each application/status combination individually
            for (var _i = 0, denormalised_2 = denormalised; _i < denormalised_2.length; _i++) {
                var app = denormalised_2[_i];
                _loop_4(app);
            }
            // just keep the best scenarios
            if (adjacency >= bestAdjacency) {
                // reset the best if needed
                if (adjacency > bestAdjacency) {
                    scenarios = [];
                    bestAdjacency = adjacency;
                }
                scenarios.push(isXLong ? { y: { name: shortAxis.name, values: shortAxisValues }, x: { name: longAxis.name, values: longAxisValues } } : { x: { name: shortAxis.name, values: shortAxisValues }, y: { name: longAxis.name, values: longAxisValues } });
            }
        };
        for (var _d = 0, _e = (isXLong ? yF : xF)(shortAxis); _d < _e.length; _d++) {
            var shortAxisValues = _e[_d];
            _loop_2(shortAxisValues);
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
