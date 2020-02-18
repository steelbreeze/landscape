/**
 * Flexes a dimension, generating all ordering permutations of an array.
 * @param source The source array of string.
 * @returns Returns and array of all permutations of the array.
 * @hidden
 */
export function permutations<T>(source: Array<T>): Array<Array<T>> {
	const result: Array<Array<T>> = [];

	if (source.length === 1) {
		result.push(source);
	} else {
		source.forEach((exclude, excludeIndex) => {
			for (const excluded of permutations(source.filter((element, elementIndex) => elementIndex !== excludeIndex))) {
				result.push([exclude, ...excluded]);
			}
		});
	}

	return result;
}
