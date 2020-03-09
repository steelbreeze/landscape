import { IApplicationDetail } from './IApplication';

/**
 * A single cell in the final table structure, ready for transforming into HTML via the getHTML call or other method (e.g. D3)
 */
export interface ICell extends IApplicationDetail {
	/** The style to use when rendering the table. */
	style: string;

	/** The number of columns that this cell will span in the rendered table. */
	cols: number;

	/** The number of rows that this cell will span in the rendered table. */
	rows: number;

	/** The height of a row as a percentage of a full row. */
	height: number;
}
