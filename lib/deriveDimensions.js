"use strict";
exports.__esModule = true;
exports.deriveDimensions = void 0;
/**
 * Extracts all the dimensions seen within the the use of the applications as a set of axis objects.
 * @param applications The application data to extract the dimensions of.
 * @returns an dictionary of [IAxis] structures, keyed by the dimension name.
 */
function deriveDimensions(applications) {
    var index = {};
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var application = applications_1[_i];
        for (var _a = 0, _b = application.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            for (var _c = 0, _d = Object.getOwnPropertyNames(use.dimensions); _c < _d.length; _c++) {
                var name_1 = _d[_c];
                var axis = index[name_1] || (index[name_1] = { name: name_1, values: [] });
                var value = use.dimensions[name_1];
                if (axis.values.indexOf(value) === -1) {
                    axis.values.push(value);
                }
            }
        }
    }
    return index;
}
exports.deriveDimensions = deriveDimensions;
