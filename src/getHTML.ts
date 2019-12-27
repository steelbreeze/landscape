import { Cell } from './Cell';

export function getHTML(table: Array<Array<Cell>>): string {
    return table.reduce((res: string, row: Array<Cell>) => `${res}<tr>${row.reduce((res: string, cell: Cell) => `${res}<td class="${cell.style} height${Math.round(cell.height / 10)}" colspan="${cell.colspan}" rowspan="${cell.rowspan}">${cell.detail.name || ""}</td>`, "")}</tr>`, "");
}
