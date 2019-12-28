"use strict";
exports.__esModule = true;
function pairs(value) {
    var result = [];
    for (var i = value; --i;) {
        for (var j = i; j--;) {
            result.push([i, j]);
        }
    }
    return result;
}
function tom(applications, x, y) {
    var isXAxisLonger = x.values.length >= y.values.length;
    var longAxis = isXAxisLonger ? x.values : y.values;
    var shortAxis = isXAxisLonger ? y.values : x.values;
    for (var _i = 0, _a = pairs(shortAxis.length); _i < _a.length; _i++) {
        var pair = _a[_i];
        console.log(shortAxis[pair[0]] + " / " + shortAxis[pair[1]]);
    }
    return [{ x: x, y: y }];
}
exports.tom = tom;
