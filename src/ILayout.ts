/**
 * A single cell in the final table structure, ready for transforming into HTML via the getHTML call or other method (e.g. D3)
 */
export interface ILayout {
	/** The text to display in a cell. */
	text: unknown;

	/** The style to use when rendering the table. */
	style: unknown;

	/** The number of columns that this cell will span in the rendered table. */
	cols: number;

	/** The number of rows that this cell will span in the rendered table. */
	rows: number;

	/** The height of a cell as a percentage of a full row. */
	height: number;

	/** The width of a cell as a percentage of a full column. */
	width: number;
}
