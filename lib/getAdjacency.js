"use strict";
exports.__esModule = true;
/**
 * Gets an adjacencey count for applications in a given scenario (sequence of axes values)
 * @param denormalised The denormalised application data
 * @param xAxis The xAxis
 * @param yAxis The yAxis
 * @returns Returns an adjacency count; the number of adjacent cells in the x and y dimensions
 * @hidden
 */
function getAdjacency(denormalised, xAxis, yAxis) {
    var adjacency = 0;
    var _loop_1 = function (app) {
        // create 2d boolean matrix where the application exists 
        var matrix = yAxis.map(function (y) { return xAxis.map(function (x) { return app.usage.some(function (use) { return use.y === y && use.x === x; }); }); });
        // count adjacent cells
        for (var iY = yAxis.length; iY--;) {
            for (var iX = xAxis.length; iX--;) {
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
    for (var _i = 0, denormalised_1 = denormalised; _i < denormalised_1.length; _i++) {
        var app = denormalised_1[_i];
        _loop_1(app);
    }
    return adjacency;
}
exports.getAdjacency = getAdjacency;
