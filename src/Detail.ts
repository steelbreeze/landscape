export interface Detail {
    /** An identifier for the application. */
    id: string | number | undefined;

    /** The name of the application. */
    name: string | undefined;
}

export function noDetail(name: string | undefined = undefined) {
    return { id: undefined, name };
}