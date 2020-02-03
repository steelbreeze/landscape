"use strict";
exports.__esModule = true;
/**
 * An always true predicate.
 * @hidden
 */
var fTrue = function () { return true; };
/**
 * Determine if a date exists within a date range.
 * @param date The date to test.
 * @param start The start of the range; if undefined the range start at the begining of time.
 * @param end The end of the range; if undefined the range ends at the end of time.
 * @returns True if the date is within the range
 * @hidden
 */
function between(date, start, end) {
    return (start === undefined || date >= start) && (end === undefined || date <= end);
}
/**
 * Filter a set of applications based on application and/or usage criteria.
 * @param applications The set of applications to filter.
 * @param useCriteria The application usage criteria.
 * @param appCriteria The application criteria
 * @returns The filtered set of applications
 * @hidden
 */
function filter(applications, useCriteria, appCriteria) {
    if (useCriteria === void 0) { useCriteria = fTrue; }
    if (appCriteria === void 0) { appCriteria = fTrue; }
    return applications.filter(appCriteria).map(function (app) { return { detail: app.detail, usage: app.usage.filter(useCriteria) }; }).filter(function (app) { return app.usage.length > 0; });
}
/**
 * Filters the applications to determine what was in use at a particular point in time.
 * @remarks The filter uses the optional commissioned and decomissioned date of the application use records.
 * @param applications The full set of applications.
 * @param date The date to filter the applications by.
 * @returns Returns the subset of applications that were in use on the specified date.
 */
function filterByDate(applications, date) {
    return filter(applications, function (use) { return between(date, use.commissioned, use.decommissioned); });
}
exports.filterByDate = filterByDate;
