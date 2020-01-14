"use strict";
exports.__esModule = true;
/**
 * An implementation of the IDetail interface, for application detail generated within the library.
 * @hidden
 */
var Detail = /** @class */ (function () {
    /**
     * Creates an instance of the Detail class.
     * @param id The application id.
     * @param name The application name.
     */
    function Detail(id, name) {
        if (id === void 0) { id = ""; }
        if (name === void 0) { name = ""; }
        this.id = id;
        this.name = name;
    }
    return Detail;
}());
exports.Detail = Detail;
