import { IApplication, IDetail } from './IApplication';
import { ILayout } from './ILayout';

/**
 * Renders a table as HTML.
 * @param table The application table, returned by [getTable]
 */
export function getHTML(table: Array<Array<IApplication & ILayout>>, renderer: (detail: IDetail) => string = (detail) => detail.name): string {
	return table.reduce((res, row) => `${res}${rowsBuilder(row, renderer)}`, "");
}

/**
 * Creates a table row.
 * @hidden
 */
function rowsBuilder(row: Array<IApplication & ILayout>, renderer: (detail: IDetail) => string): string {
	return `<tr>${row.reduce((res, cell) => `${res}${cellsBuilder(cell, renderer)}`, "")}</tr>`;
}

/**
 * Creates the cells within a table row.
 * @hidden
 */
function cellsBuilder(cell: IApplication & ILayout, renderer: (detail: IDetail) => string): string {
	return `<td class="${cell.style} height${Math.round(cell.height * 10)}" colspan="${cell.cols}" rowspan="${cell.rows}">${renderer(cell.detail)}</td>`;
}