export interface Detail {
	/** An identifier for the application. */
	id: string | number;

	/** The name of the application. */
	name: string;
}

export function noDetail(id: number | string = "", name: string = ""): Detail {
	return { id, name };
}