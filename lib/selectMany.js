"use strict";
exports.__esModule = true;
/**
 * Iterates over an array of arrays
 * @param source The parent array.
 * @param collectionSelector A function to return the child array for each element of the parent array.
 * @param resultSelector A function to build the result elements.
 */
function selectMany(source, collectionSelector, resultSelector) {
    var result = [];
    var resultIndex = 0;
    var elementIndex = 0;
    for (var _i = 0, source_1 = source; _i < source_1.length; _i++) {
        var element = source_1[_i];
        for (var _a = 0, _b = collectionSelector(element, elementIndex++); _a < _b.length; _a++) {
            var subElement = _b[_a];
            result[resultIndex++] = resultSelector(subElement, element);
        }
    }
    return result;
}
exports.selectMany = selectMany;
