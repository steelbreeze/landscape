"use strict";
exports.__esModule = true;
function getHTML(table) {
    return table.reduce(function (res, row) { return res + "<tr>" + row.reduce(function (res, cell) { return res + "<td class=\"" + cell.style + " height" + Math.round(cell.height / 10) + "\" colspan=\"" + cell.colspan + "\" rowspan=\"" + cell.rowspan + "\">" + (cell.detail.name || "") + "</td>"; }, "") + "</tr>"; }, "");
}
exports.getHTML = getHTML;
