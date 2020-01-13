"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var selectMany_1 = require("./selectMany");
/**
 * Flexes a dimension, generating all ordering permutations of an array of strings.
 * @param source The source array of string.
 * @returns Returns and array of all permutations of the array of strings.
 * @hidden
 */
function permutations(source) {
    if (source.length === 1) {
        return [source];
    }
    else {
        return selectMany_1.selectMany(source, function (exclude, excludeIndex) { return permutations(source.filter(function (element, elementIndex) { return elementIndex !== excludeIndex; })); }, function (filtered, excluded) { return __spreadArrays([excluded], filtered); });
    }
}
exports.permutations = permutations;
