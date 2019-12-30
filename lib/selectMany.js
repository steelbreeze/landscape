"use strict";
exports.__esModule = true;
function selectMany(elements, collectionSelector, resultSelector) {
    var result = [];
    var index = 0;
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var element = elements_1[_i];
        for (var _a = 0, _b = collectionSelector(element); _a < _b.length; _a++) {
            var subElement = _b[_a];
            result[index++] = resultSelector(subElement, element);
        }
    }
    return result;
}
exports.selectMany = selectMany;
