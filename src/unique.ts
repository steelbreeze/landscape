export function unique<T>(value: T, index: number, array: Array<T>): boolean {
    return array.indexOf(value) === index;
}