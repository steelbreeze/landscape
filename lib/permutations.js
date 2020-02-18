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
 * Flexes a dimension, generating all ordering permutations of an array.
 * @param source The source array of string.
 * @returns Returns and array of all permutations of the array.
 * @hidden
 */
function permutations(source) {
    var result = [];
    if (source.length === 1) {
        result.push(source);
    }
    else {
        source.forEach(function (exclude, excludeIndex) {
            for (var _i = 0, _a = permutations(source.filter(function (element, elementIndex) { return elementIndex !== excludeIndex; })); _i < _a.length; _i++) {
                var excluded = _a[_i];
                result.push(__spreadArrays([exclude], excluded));
            }
        });
    }
    return result;
}
exports.permutations = permutations;
