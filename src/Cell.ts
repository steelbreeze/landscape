import { Detail } from './Detail';

/** Represents a cell within a table. */
export class Cell {
    public height = 100;

    /**
     * Creates a new instance of the Cell class.
     * @param detail The application details.
     * @param style The applications styling; used to drive the CSS class.
     * @param colspan The number of columns that the application should span.
     * @param rowspan The numbe or row that the application should span.
     * @param height The height of the cell out of 100 (this can be greater for merged cells, or smaller for split cells).
     */
    public constructor(public readonly detail: Detail, public style: string, public colspan: number = 1, public rowspan: number = 1, public split: number = 1) {
        this.height = 100 / split;
    }

    /**
     * Clones the cell; used when splitting rows.
     * @returns Returns a copy of the object with seperate identity.
     */
    public clone(split: number): Cell {
        return new Cell(this.detail, this.style, this.colspan, this.rowspan, split);
    }
}
