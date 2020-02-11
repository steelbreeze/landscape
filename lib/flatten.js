"use strict";
exports.__esModule = true;
/**
 * Denormalise the application data into an intermedia
 * @param applications
 * @param x
 * @param y
 * @hidden
 */
function flatten(applications, x, y) {
    // denormalise the underlying application data and resolve the axes
    var interim = [];
    var _loop_1 = function (app) {
        var _loop_2 = function (use) {
            var interimApp = interim.filter(function (a) { return a.detail.id === app.detail.id && a.status === use.status; })[0];
            if (!interimApp) {
                interimApp = { detail: app.detail, status: use.status, usage: [] };
                interim.push(interimApp);
            }
            interimApp.usage.push({ x: use.dimensions[x.name], y: use.dimensions[y.name] });
        };
        for (var _i = 0, _a = app.usage; _i < _a.length; _i++) {
            var use = _a[_i];
            _loop_2(use);
        }
    };
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        _loop_1(app);
    }
    // delete single use app/status combinations as they cannot contribute to affinity score
    return interim.filter(function (app) { return app.usage.length > 1; });
}
exports.flatten = flatten;
