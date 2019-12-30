export function selectMany<TElement, TCollection, TResult>(elements: Array<TElement>, collectionSelector: (element: TElement) => Array<TCollection>, resultSelector: (subElement: TCollection, element: TElement) => TResult): Array<TResult> {
    let result: Array<TResult> = [];
    let index = 0;

    for(const element of elements) {
        for(const subElement of collectionSelector(element)) {
            result[index++] =resultSelector(subElement, element);
        }
    }

    return result;
}
