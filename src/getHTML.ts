import { IApplication } from './IApplication';
import { ILayout } from './ILayout';

/**
 * Renders a table as HTML.
 * @param table The application table, returned by [getTable]
 */
export function getHTML(table: Array<Array<IApplication & ILayout>>): string {
	return table.reduce(rowsBuilder, "");
}

/**
 * Creates a table row.
 * @hidden
 */
function rowsBuilder(res: string, row: Array<IApplication & ILayout>): string {
	return `${res}<tr>${row.reduce(cellsBuilder, "")}</tr>`;
}

/**
 * Creates the cells within a table row.
 * @hidden
 */
function cellsBuilder(res: string, cell: IApplication & ILayout): string {
	return `${res}<td class="${cell.style} height${Math.round(cell.height * 10)}" colspan="${cell.cols}" rowspan="${cell.rows}">${cell.detail.name}</td>`;
}