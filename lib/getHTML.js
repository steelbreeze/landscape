"use strict";
exports.__esModule = true;
function getHTML(table) {
    return table.reduce(rowsBuilder, "");
}
exports.getHTML = getHTML;
function rowsBuilder(res, row) {
    return res + "<tr>" + row.reduce(cellsBuilder, "") + "</tr>";
}
function cellsBuilder(res, cell) {
    return res + "<td class=\"" + cell.style + " height" + Math.round(cell.height / 10) + "\" colspan=\"" + cell.colspan + "\" rowspan=\"" + cell.rowspan + "\">" + (cell.detail.name || "") + "</td>";
}
