// @steelbreeze/landscape
import { Tabular } from './Tabular';
import { IAxis } from './IAxis';

/**
 * Extracts the unique values for particualar columns in the source data to be used as dimensions.
 * @param columns The columns to extract the dimensions for (set of unique values).
 * @param tabular The source data to extract the dimensions of.
 * @returns an array of IAxis structures.
 */
export function deriveDimensions(columns: Array<string>, tabular: Tabular): Array<IAxis> {
	return columns.map(name => { return { name, values: tabular.map(row => row[name]).filter(distinct) }; });
}

/**
 * Filter to find unique values of an array.
 * @param value The value to test.
 * @param index The index of the value within the source array.
 * @param source The source array.
 * @hidden
 */
function distinct<TValue>(value: TValue, index: number, source: Array<TValue>): boolean {
	return source.indexOf(value) === index;
}
