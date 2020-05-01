"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var deriveAxis_1 = require("./deriveAxis");
exports.deriveAxes = deriveAxis_1.deriveAxes;
var deriveDimensions_1 = require("./deriveDimensions");
exports.deriveDimensions = deriveDimensions_1.deriveDimensions;
var getOptimalAxes_1 = require("./getOptimalAxes");
exports.getOptimalAxes = getOptimalAxes_1.getOptimalAxes;
exports.flexOrder = getOptimalAxes_1.flexOrder;
__export(require("./render"));
