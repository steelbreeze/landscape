/** A user-defined composite key into the data for determining uniqueness within the displayed data */
export interface IKey {
	/** The text that will be rendered by a call to getTable */
	text: unknown;

	/** The style that will be returned by a call to getTable */
	style: unknown;
}
