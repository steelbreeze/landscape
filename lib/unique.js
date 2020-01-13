"use strict";
exports.__esModule = true;
/**
 * Filter criteria to select a unique set of elements from an array
 * @hidden
 */
function unique(value, index, array) {
    return array.indexOf(value) === index;
}
exports.unique = unique;
