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
function tom(applications, axes) {
    var isXAxisLonger = axes.xValues.length >= axes.yValues.length;
    var longAxis = isXAxisLonger ? axes.xValues : axes.yValues;
    var shortAxis = isXAxisLonger ? axes.yValues : axes.xValues;
    for (var _i = 0, _a = pairs(shortAxis.length); _i < _a.length; _i++) {
        var pair = _a[_i];
        console.log(shortAxis[pair[0]] + " / " + shortAxis[pair[1]]);
    }
    return [axes];
}
exports.tom = tom;
