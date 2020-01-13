import { Cell } from './Cell';

/**
 * Renders a table as HTML.
 * @param table The application table, returned by [getTable]
 */
export function getHTML(table: Array<Array<Cell>>): string {
	return table.reduce(rowsBuilder, "");
}

/**
 * Creates a table row.
 * @hidden
 */
function rowsBuilder(res: string, row: Array<Cell>): string {
	return `${res}<tr>${row.reduce(cellsBuilder, "")}</tr>`;
}

/**
 * Creates the cells within a table row.
 * @hidden
 */
function cellsBuilder(res: string, cell: Cell): string {
	return `${res}<td class="${cell.style} height${Math.round(cell.height / 10)}" colspan="${cell.colspan}" rowspan="${cell.rowspan}">${cell.detail.name || ""}</td>`;
}