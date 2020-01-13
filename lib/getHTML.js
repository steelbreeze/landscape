"use strict";
exports.__esModule = true;
/**
 * Renders a table as HTML.
 * @param table The application table, returned by [getTable]
 */
function getHTML(table) {
    return table.reduce(rowsBuilder, "");
}
exports.getHTML = getHTML;
/**
 * Creates a table row.
 * @hidden
 */
function rowsBuilder(res, row) {
    return res + "<tr>" + row.reduce(cellsBuilder, "") + "</tr>";
}
/**
 * Creates the cells within a table row.
 * @hidden
 */
function cellsBuilder(res, cell) {
    return res + "<td class=\"" + cell.style + " height" + Math.round(cell.height / 10) + "\" colspan=\"" + cell.colspan + "\" rowspan=\"" + cell.rowspan + "\">" + (cell.detail.name || "") + "</td>";
}
