"use strict";
exports.__esModule = true;
var Axis_1 = require("./Axis");
/**
 * Returns the unique set of values within an application data set for a given dimension.
 * @param applications The applications data.
 * @param name The name of the dimension.
 * @returns Returns the axis with its values.
 */
function getAxis(applications, name) {
    var axis = new Axis_1.Axis(name, []);
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
    //	return new Axis(name, selectMany(applications, app => app.usage, use => use.dimensions[name]).filter(unique));
}
exports.getAxis = getAxis;
