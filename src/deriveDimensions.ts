// @steelbreeze/landscape
// Copyright (c) 2019 David Mesquita-Morris
import { Dictionary } from './Dictionary';
import { Tabular } from './Tabular';
import { IAxis } from './IAxis';

/**
 * Extracts the unique values for particualar columns in the source data to be used as dimensions.
 * @param columns The columns to extract the dimensions for (set of unique values).
 * @param tabular The application data to extract the dimensions of.
 * @returns an dictionary of [IAxis] structures, keyed by the dimension name.
 */
export function deriveDimensions(columns: Array<string>, tabular: Tabular): Dictionary<IAxis> {
	const index: Dictionary<IAxis> = {};

	for (const row of tabular) {
		for (const name of columns) {
			const axis = index[name] || (index[name] = { name, values: [] });
			const value = row[name];

			if (value) {
				if (axis.values.indexOf(value) === -1) {
					axis.values.push(value)
				}
			}
		}
	}

	return index;
}
