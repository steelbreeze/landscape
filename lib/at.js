"use strict";
exports.__esModule = true;
function between(date, start, end) {
    return (start === undefined || date >= start) && (end === undefined || date <= end);
}
function dateOfInterest(applications, date) {
    return applications.map(function (app) { return { name: app.name, uses: app.uses.filter(function (use) { return between(date, use.commissioned, use.decommissioned); }) }; });
}
exports.dateOfInterest = dateOfInterest;
