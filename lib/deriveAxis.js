"use strict";
exports.__esModule = true;
/**
 * Extracts the list of unique values for a dimension from underlying application data.
 * @param applications The underlying application data.
 * @param dimension The name of the dimension.
 * @returns Returns an [IAxis] structure for hte
 */
function deriveAxis(applications, dimension) {
    var values = [];
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var application = applications_1[_i];
        for (var _a = 0, _b = application.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            var value = use.dimensions[dimension];
            if (values.indexOf(value) === -1) {
                values.push(value);
            }
        }
    }
    return { name: dimension, values: values };
}
exports.deriveAxis = deriveAxis;
