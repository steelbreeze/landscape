"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveDimensions = void 0;
/**
 * Extracts the unique values for particualar columns in the source data to be used as dimensions.
 * @param columns The columns to extract the dimensions for (set of unique values).
 * @param tabular The application data to extract the dimensions of.
 * @returns an dictionary of [IAxis] structures, keyed by the dimension name.
 */
function deriveDimensions(columns, tabular) {
    const index = {};
    for (const row of tabular) {
        for (const name of columns) {
            const axis = index[name] || (index[name] = { name, values: [] });
            const value = row[name];
            if (value) {
                if (axis.values.indexOf(value) === -1) {
                    axis.values.push(value);
                }
            }
        }
    }
    return index;
}
exports.deriveDimensions = deriveDimensions;
