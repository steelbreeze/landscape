/**
 * Flexes a dimension, generating all ordering permutations of an array of strings.
 * @param source The source array of string.
 * @returns Returns and array of all permutations of the array of strings.
 */
export function flex(source: Array<string>): Array<Array<string>> {
    if (source.length === 1) {
        return [source];
    } else {
        const result: Array<Array<string>> = [];

        for (const exclude of source) {
            for (const subElement of flex(source.filter((element) => element !== exclude))) {
                result.push([exclude, ...subElement]);
            }
        }

        return result;
    }
}
