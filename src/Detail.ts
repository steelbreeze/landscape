/**
 * The meta data associated with an application excluding its usage context.
 */
export interface Detail {
	/** An identifier for the application. */
	id: string | number;

	/** The name of the application. */
	name: string;
}

/**
 * Creates a blank application detail object
 * @param id The application id
 * @param name The application name
 * @hidden
 */
export function noDetail(id: number | string = "", name: string = ""): Detail {
	return { id, name };
}