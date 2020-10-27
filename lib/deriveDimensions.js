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
    return columns.map(name => { return { name, values: tabular.map(row => row[name]).filter(distinct) }; });
}
exports.deriveDimensions = deriveDimensions;
/**
 * Filter to find unique values of an array.
 * @param value The value to test.
 * @param index The index of the value within the source array.
 * @param source The source array.
 * @hidden
 */
function distinct(value, index, source) {
    return source.indexOf(value) === index;
}
