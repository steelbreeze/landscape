"use strict";
exports.__esModule = true;
/**
 * An axis to use to layout a landscape.
 */
var Axis = /** @class */ (function () {
    /**
     * Creates a new instance of the Axis class.
     * @param name The name of the dimension to use as the axis.
     * @param values An ordered set of the unique values of the dimension.
     */
    function Axis(name, values) {
        this.name = name;
        this.values = values;
    }
    /**
     * Derives an axis to be used in the map layout from underlying application data.
     * @param applications The applications data.
     * @param name The name of the dimension.
     * @returns Returns the axis with its values.
     */
    Axis.derive = function (applications, name) {
        var axis = new Axis(name, []);
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
    };
    return Axis;
}());
exports.Axis = Axis;
