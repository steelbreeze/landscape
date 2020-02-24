"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var deriveAxis_1 = require("./deriveAxis");
exports.deriveAxis = deriveAxis_1.deriveAxis;
var getOptimalAxes_1 = require("./getOptimalAxes");
exports.getOptimalAxes = getOptimalAxes_1.getOptimalAxes;
exports.flexOrder = getOptimalAxes_1.flexOrder;
__export(require("./render"));
