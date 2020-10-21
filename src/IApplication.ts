/** An object whose properties are keyed by string and having a common type. */
export interface Dictionary<TValue = unknown> {
	[key: string]: TValue;
}

/** The source data for the landscape tool, a table represented as an array of dictionaries */
export interface Source extends Array<Dictionary> {
	// TODO: could this move to a column-oriented structure?
}

/** A user-defined composite key into the data for determining uniqueness within the displayed data */
export interface IKey {
	/** The text that will be rendered by a call to getTable */
	text: unknown;

	/** The style that will be returned by a call to getTable */
	style: unknown;
}

/** A key in a wider data structure */
export interface IKeyed {
	key: IKey;
}
