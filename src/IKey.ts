// @steelbreeze/landscape
// Copyright (c) 2019 David Mesquita-Morris

/** A user-defined composite key into the data for determining uniqueness within the displayed data */
export interface IKey {
	/** The text that will be rendered by a call to getTable */
	text: any;

	/** The style that will be returned by a call to getTable */
	style: any;

	/** Space for arbitory user data, this is not used in any comparisons, but is passed through */
	data: any;
}
