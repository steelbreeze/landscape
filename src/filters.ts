import { Application } from './Application';

/**
 * Determine if a date exists within a date range. 
 * @param date The date to test.
 * @param start The start of the range; if undefined the range start at the begining of time.
 * @param end The end of the range; if undefined the range ends at the end of time.
 * @returns True if the date is within the range
 */
function between(date: Date, start: Date | undefined, end: Date | undefined) {
    return (start === undefined || date >= start) && (end === undefined || date <= end);
}

/**
 * Filters the applications to determine what was in use at a particular point in time.
 * @param applications The full set of applications.
 * @param date The date to filter the applications by.
 * @returns Returns the subset of applications that were in use on the specified date.
 */
export function filterByDate(applications: Array<Application>, date: Date): Array<Application> {
    return applications.map(app => { return { name: app.name, usage: app.usage.filter(use => between(date, use.commissioned, use.decommissioned)) } }).filter(app => app.usage.length > 0);
}

export function filterTarget(applications: Array<Application>): Array<Application> {
    return applications.map(app => { return { name: app.name, usage: app.usage.filter(use => !use.decommissioned) } }).filter(app => app.usage.length > 0);
}
