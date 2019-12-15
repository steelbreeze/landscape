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
 * Generates all ordering permutations of an array of strings.
 * @param source The source array of string.
 * @returns Returns and array of all permutations of the array of strings.
 */
function permutations(source) {
    if (source.length === 1) {
        return [source];
    }
    else {
        var result = [];
        var _loop_1 = function (exclude) {
            for (var _i = 0, _a = permutations(source.filter(function (element) { return element !== exclude; })); _i < _a.length; _i++) {
                var subElement = _a[_i];
                result.push(__spreadArrays([exclude], subElement));
            }
        };
        for (var _i = 0, source_1 = source; _i < source_1.length; _i++) {
            var exclude = source_1[_i];
            _loop_1(exclude);
        }
        return result;
    }
}
exports.permutations = permutations;
