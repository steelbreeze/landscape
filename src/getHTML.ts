import { Cell } from './Cell';

export function getHTML(table: Array<Array<Cell>>): string {
	return table.reduce(rowsBuilder, "");
}

function rowsBuilder(res: string, row: Array<Cell>): string {
	return `${res}<tr>${row.reduce(cellsBuilder, "")}</tr>`;
}

function cellsBuilder(res: string, cell: Cell): string {
	return `${res}<td class="${cell.style} height${Math.round(cell.height / 10)}" colspan="${cell.colspan}" rowspan="${cell.rowspan}">${cell.detail.name || ""}</td>`;
}