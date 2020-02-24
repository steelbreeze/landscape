"use strict";
exports.__esModule = true;
function deriveAxis(applications, name) {
    var axis = { name: name, values: [] };
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var application = applications_1[_i];
        for (var _a = 0, _b = application.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            var value = use.dimensions[name];
            if (axis.values.indexOf(value) === -1) {
                axis.values.push(value);
            }
        }
    }
    return axis;
}
exports.deriveAxis = deriveAxis;
