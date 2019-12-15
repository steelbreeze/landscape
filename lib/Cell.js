"use strict";
exports.__esModule = true;
/** Represents a cell within a table. */
var Cell = /** @class */ (function () {
    /**
     * Creates a new instance of the Cell class.
     * @param name The name of the application.
     * @param style The applications styling; used to drive the CSS class.
     * @param colspan The number of columns that the application should span.
     * @param rowspan The numbe or row that the application should span.
     * @param height The height of the cell out of 100 (this can be greater for merged cells, or smaller for split cells).
     */
    function Cell(name, style, colspan, rowspan, split) {
        if (colspan === void 0) { colspan = 1; }
        if (rowspan === void 0) { rowspan = 1; }
        if (split === void 0) { split = 1; }
        this.name = name;
        this.style = style;
        this.colspan = colspan;
        this.rowspan = rowspan;
        this.split = split;
        this.height = 100;
        this.height = 100 / split;
    }
    /**
     * Clones the cell; used when splitting rows.
     * @returns Returns a copy of the object with seperate identity.
     */
    Cell.prototype.clone = function (split) {
        return new Cell(this.name, this.style, this.colspan, this.rowspan, split);
    };
    return Cell;
}());
exports.Cell = Cell;
