"use strict";
exports.__esModule = true;
var flatten_1 = require("./flatten");
var getAdjacency_1 = require("./getAdjacency");
/**
 * Returns all pairs of numbers from 0 to n -1
 * @param value
 * @hidden
 */
function pairs(value) {
    var result = [];
    for (var i = value; --i;) {
        for (var j = i; j--;) {
            result.push([i, j]);
        }
    }
    return result;
}
/**
 * Tom's algorithm as an alternative to getOptimalAxes
 * @param applications
 * @param x
 * @param y
 * @hidden
 */
function tom(applications, x, y) {
    var isXAxisLonger = x.values.length >= y.values.length;
    var longAxis = isXAxisLonger ? x.values : y.values;
    var shortAxis = isXAxisLonger ? y.values : x.values;
    // flatten the application data
    var denormalised = flatten_1.flatten(applications, x, y);
    for (var _i = 0, _a = pairs(shortAxis.length); _i < _a.length; _i++) {
        var pair = _a[_i];
        var adjacency = getAdjacency_1.getAdjacency(denormalised, longAxis, [shortAxis[pair[0]], shortAxis[pair[1]]]);
        console.log(shortAxis[pair[0]] + " / " + shortAxis[pair[1]] + " = " + adjacency);
    }
    return [{ x: x, y: y }];
}
exports.tom = tom;
