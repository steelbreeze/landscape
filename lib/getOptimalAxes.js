"use strict";
exports.__esModule = true;
var permutations_1 = require("./permutations");
/**
 * Determine the optimum order of the axes resulting in a layout with applications grouped together
 * @param applications The raw application data
 * @param x The x axis
 * @param y The y axis
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
function getOptimalAxes(applications, x, y, xF, yF) {
    if (xF === void 0) { xF = flexOrder; }
    if (yF === void 0) { yF = flexOrder; }
    var result = [];
    var bestAdjacency = -1;
    // denormalise the underlying application data and resolve the axes
    var interim = [];
    var _loop_1 = function (app) {
        var _loop_3 = function (use) {
            var interimApp = interim.filter(function (a) { return a.detail.id === app.detail.id && a.status === use.status; })[0];
            if (!interimApp) {
                interimApp = { detail: app.detail, status: use.status, usage: [] };
                interim.push(interimApp);
            }
            interimApp.usage.push({ x: use[x.name], y: use[y.name] });
        };
        for (var _i = 0, _a = app.usage; _i < _a.length; _i++) {
            var use = _a[_i];
            _loop_3(use);
        }
    };
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        _loop_1(app);
    }
    // delete single use app/status combinations as they cannot contribute to affinity score
    interim = interim.filter(function (app) { return app.usage.length > 1; });
    // some items not to recalculate in an O(n!) algo
    var xPerms = xF(x);
    // iterate all X and Y using the formulas provided
    for (var _a = 0, _b = yF(y); _a < _b.length; _a++) {
        var yValues = _b[_a];
        var _loop_2 = function (xValues) {
            var adjacency = 0;
            var _loop_4 = function (app) {
                // create 2d boolean matrix where the application exists 
                var matrix = yValues.map(function (y) { return xValues.map(function (x) { return app.usage.some(function (use) { return use.y === y && use.x === x; }); }); });
                // count adjacent cells
                for (var iY = yValues.length; iY--;) {
                    for (var iX = xValues.length; iX--;) {
                        if (matrix[iY][iX]) {
                            if (iY && matrix[iY - 1][iX]) {
                                adjacency++;
                            }
                            if (iX && matrix[iY][iX - 1]) {
                                adjacency++;
                            }
                        }
                    }
                }
            };
            // test each application/status combination individually
            for (var _i = 0, interim_1 = interim; _i < interim_1.length; _i++) {
                var app = interim_1[_i];
                _loop_4(app);
            }
            // just keep the best scenarios
            if (adjacency >= bestAdjacency) {
                if (adjacency > bestAdjacency) {
                    result = [];
                    bestAdjacency = adjacency;
                }
                result.push({ x: { name: x.name, values: xValues }, y: { name: y.name, values: yValues } });
            }
        };
        for (var _c = 0, xPerms_1 = xPerms; _c < xPerms_1.length; _c++) {
            var xValues = xPerms_1[_c];
            _loop_2(xValues);
        }
    }
    return result;
}
exports.getOptimalAxes = getOptimalAxes;
/**
 * Allow an axis to be assessed in any order of the axis values.
 * @param axis The axis to flex
 */
function flexOrder(axis) {
    return permutations_1.permutations(axis.values);
}
exports.flexOrder = flexOrder;
