import { selectMany } from "./selectMany";

/**
 * Flexes a dimension, generating all ordering permutations of an array of strings.
 * @param source The source array of string.
 * @returns Returns and array of all permutations of the array of strings.
 */
export function permutations<T>(source: Array<T>): Array<Array<T>> {
	if (source.length === 1) {
		return [source];
	} else {
		return selectMany(source, (exclude, excludeIndex) => permutations(source.filter((element, elementIndex) => elementIndex !== excludeIndex)), (filtered, excluded) => [excluded, ...filtered]);
	}
}
