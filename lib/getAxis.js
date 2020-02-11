"use strict";
exports.__esModule = true;
var Axis_1 = require("./Axis");
var selectMany_1 = require("./selectMany");
var unique_1 = require("./unique");
/**
 * Returns the unique set of values within an application data set for a given dimension.
 * @param applications The applications data.
 * @param name The name of the dimension.
 * @returns Returns the axis with its values.
 */
function getAxis(applications, name) {
    /*
        const result = new Axis(name, []);
    
        for(const application of applications) {
            for (const use of application.usage) {
                result.values.push(use.dimensions[name]);
            }
        }
    
        return result;
    */
    return new Axis_1.Axis(name, selectMany_1.selectMany(applications, function (app) { return app.usage; }, function (use) { return use.dimensions[name]; }).filter(unique_1.unique));
}
exports.getAxis = getAxis;
