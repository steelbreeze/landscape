"use strict";
exports.__esModule = true;
/**
 * Renders a table as HTML.
 * @param table The application table, returned by [getTable]
 */
function getHTML(table, renderer) {
    if (renderer === void 0) { renderer = function (detail) { return detail.name; }; }
    return table.reduce(function (res, row) { return "" + res + rowsBuilder(row, renderer); }, "");
}
exports.getHTML = getHTML;
/**
 * Creates a table row.
 * @hidden
 */
function rowsBuilder(row, renderer) {
    return "<tr>" + row.reduce(function (res, cell) { return "" + res + cellsBuilder(cell, renderer); }, "") + "</tr>";
}
/**
 * Creates the cells within a table row.
 * @hidden
 */
function cellsBuilder(cell, renderer) {
    return "<td class=\"" + cell.style + " height" + Math.round(cell.height * 10) + "\" colspan=\"" + cell.cols + "\" rowspan=\"" + cell.rows + "\">" + renderer(cell.detail) + "</td>";
}
