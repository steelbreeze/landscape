"use strict";
exports.__esModule = true;
/**
 * Determine if a date exists within a date range.
 * @param date The date to test.
 * @param start The start of the range; if undefined the range start at the begining of time.
 * @param end The end of the range; if undefined the range ends at the end of time.
 * @returns True if the date is within the range
 */
function between(date, start, end) {
    return (start === undefined || date >= start) && (end === undefined || date <= end);
}
/**
 * Filters the applications to determine what was in use at a particular point in time.
 * @param applications The full set of applications.
 * @param date The date to filter the applications by.
 * @returns Returns the subset of applications that were in use on the specified date.
 */
function filterByDate(applications, date) {
    return applications.map(function (app) { return { name: app.name, usage: app.usage.filter(function (use) { return between(date, use.commissioned, use.decommissioned); }) }; }).filter(function (app) { return app.usage.length > 0; });
}
exports.filterByDate = filterByDate;
function filterTarget(applications) {
    return applications.map(function (app) { return { name: app.name, usage: app.usage.filter(function (use) { return !use.decommissioned; }) }; }).filter(function (app) { return app.usage.length > 0; });
}
exports.filterTarget = filterTarget;
