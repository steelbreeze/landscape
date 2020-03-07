"use strict";
exports.__esModule = true;
/**
 * Structures and denormalises the application aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
function prepareData(applications, x, y) {
    var result = y.values.map(function () { return x.values.map(function () { return []; }); });
    for (var _i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
        var app = applications_1[_i];
        for (var _a = 0, _b = app.usage; _a < _b.length; _a++) {
            var use = _b[_a];
            result[y.values.indexOf(use.dimensions[y.name])][x.values.indexOf(use.dimensions[x.name])].push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
        }
    }
    return result;
    /*
    return y.values.map((yValue) => {
        const appsInRow = applications.filter(app => app.usage.some(use => use.dimensions[y.name] === yValue));

        return x.values.map((xValue) => {
            const appsInCell = appsInRow.filter(app => app.usage.some(use => use.dimensions[x.name] === xValue));
            const cell: Array<IApplicationInContext> = [];

            for (const app of appsInCell) {
                for (const use of app.usage) {
                    if (use.dimensions[y.name] === yValue && use.dimensions[x.name] === xValue) {
                        cell.push({ detail: app.detail, commissioned: use.commissioned, decommissioned: use.decommissioned, status: use.status });
                    }
                }
            }

            return cell;
        });
    });
    */
}
exports.prepareData = prepareData;
