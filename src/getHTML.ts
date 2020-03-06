import { ICell } from './ICell';

/**
 * Renders a table as HTML.
 * @param table The application table, returned by [getTable]
 */
export function getHTML(table: Array<Array<ICell>>): string {
	return table.reduce(rowsBuilder, "");
}

/**
 * Creates a table row.
 * @hidden
 */
function rowsBuilder(res: string, row: Array<ICell>): string {
	return `${res}<tr>${row.reduce(cellsBuilder, "")}</tr>`;
}

/**
 * Creates the cells within a table row.
 * @hidden
 */
function cellsBuilder(res: string, cell: ICell): string {
	return `${res}<td class="${cell.style} height${Math.round(cell.height * 10)}" colspan="${cell.cols}" rowspan="${cell.rows}">${cell.detail.name}</td>`;
}