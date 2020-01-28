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
    // determine the long and short axis
    var isXAxisLonger = x.values.length >= y.values.length;
    var longAxis = isXAxisLonger ? x : y;
    var shortAxis = isXAxisLonger ? y : x;
    console.log("long axis is " + longAxis.name);
    console.log("short axis is " + shortAxis.name);
    // flatten the application data
    var denormalised = flatten_1.flatten(applications, x, y);
    // get all pairs of values on the short axis
    for (var _i = 0, _a = pairs(shortAxis.values.length); _i < _a.length; _i++) {
        var pair = _a[_i];
        // test the adjacency of the pairs of long axis applications
        var adjacency = getAdjacency_1.getAdjacency(denormalised, longAxis.values, [shortAxis.values[pair[0]], shortAxis.values[pair[1]]], false);
        console.log(shortAxis.values[pair[0]] + " / " + shortAxis.values[pair[1]] + " = " + adjacency);
    }
    return [{ x: x, y: y }];
}
exports.tom = tom;
