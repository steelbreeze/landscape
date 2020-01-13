"use strict";
exports.__esModule = true;
/**
 * Creates a blank application detail object
 * @param id The application id
 * @param name The application name
 * @hidden
 */
function noDetail(id, name) {
    if (id === void 0) { id = ""; }
    if (name === void 0) { name = ""; }
    return { id: id, name: name };
}
exports.noDetail = noDetail;
