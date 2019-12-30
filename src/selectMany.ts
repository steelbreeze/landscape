/**
 * Iterates over an array of arrays
 * @param source The parent array.
 * @param collectionSelector A function to return the child array for each element of the parent array.
 * @param resultSelector A function to build the result elements.
 */
export function selectMany<TElement, TCollection, TResult>(source: Array<TElement>, collectionSelector: (element: TElement, elementIndex: number) => Array<TCollection>, resultSelector: (subElement: TCollection, element: TElement) => TResult): Array<TResult> {
    let result: Array<TResult> = [];
    let resultIndex = 0;
    let elementIndex = 0;

    for (const element of source) {
        for (const subElement of collectionSelector(element, elementIndex++)) {
            result[resultIndex++] = resultSelector(subElement, element);
        }
    }

    return result;
}
