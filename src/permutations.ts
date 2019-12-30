import { selectMany } from "./selectMany";

/**
 * Flexes a dimension, generating all ordering permutations of an array of strings.
 * @param source The source array of string.
 * @returns Returns and array of all permutations of the array of strings.
 */
export function permutations(source: Array<string>): Array<Array<string>> {
    if (source.length === 1) {
        return [source];
    } else {
        return selectMany(source, exclude => permutations(source.filter((element) => element !== exclude)), (elements, exclude) => [exclude, ...elements]);
    }
}
