import { IApplication } from './IApplication';
import { IUse } from './IUse';

/**
 * An always true predicate.
 * @hidden
 */
const fTrue = () => true;

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
export function filter(applications: Array<IApplication>, useCriteria: ((use: IUse) => boolean) | undefined = fTrue, appCriteria: ((app: IApplication) => boolean) | undefined = fTrue): Array<IApplication> {
	return applications.filter(appCriteria).map(app => { return { detail: app.detail, usage: app.usage.filter(useCriteria) } }).filter(app => app.usage.length > 0);
}

/**
 * Filters the applications to determine what was in use at a particular point in time.
 * @remarks The filter uses the optional commissioned and decomissioned date of the application use records.
 * @param applications The full set of applications.
 * @param date The date to filter the applications by.
 * @returns Returns the subset of applications that were in use on the specified date.
 */
export function filterByDate(applications: Array<IApplication>, date: Date): Array<IApplication> {
	return filter(applications, use => between(date, use.commissioned, use.decommissioned));
}
