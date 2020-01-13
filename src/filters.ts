import { Application } from './Application';
import { Use } from './Use';

/**
 * Determine if a date exists within a date range. 
 * @param date The date to test.
 * @param start The start of the range; if undefined the range start at the begining of time.
 * @param end The end of the range; if undefined the range ends at the end of time.
 * @returns True if the date is within the range
 * @hidden
 */
function between(date: Date, start: Date | undefined, end: Date | undefined) {
    return (start === undefined || date >= start) && (end === undefined || date <= end);
}

/**
 * Filter a set of applications based on application and/or usage criteria.
 * @param applications The set of applications to filter.
 * @param useCriteria The application usage criteria.
 * @param appCriteria The application criteria
 * @returns The filtered set of applications
 */
export function filter(applications: Array<Application>, useCriteria: ((use: Use) => boolean) | undefined = undefined, appCriteria: ((app: Application) => boolean) | undefined = undefined): Array<Application> {
	return applications.filter(appCriteria || (() => true)).map(app => { return { detail: app.detail, usage: app.usage.filter(useCriteria || (() => true)) } }).filter(app => app.usage.length > 0);
}

/**
 * Filters the applications to determine what was in use at a particular point in time.
 * @param applications The full set of applications.
 * @param date The date to filter the applications by.
 * @returns Returns the subset of applications that were in use on the specified date.
 */
export function filterByDate(applications: Array<Application>, date: Date): Array<Application> {
	return filter(applications, use => between(date, use.commissioned, use.decommissioned));
}
