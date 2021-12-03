import { Axes, Cube, Function, Pair, Row } from '@steelbreeze/pivot';
/** The final text and class name to use when rendering cells in a table. */
export interface Element extends Pair {
    /** The class name to use in the final table rendering. */
    style: string;
    /** Optional text to display in place of Pair.value (which is used to de-dup) */
    text?: string;
}
/** An extension of Element, adding the number of rows and columns the element will occupy in the final table rendering. */
export interface Cell extends Element {
    /** The number of rows to occupy. */
    rows: number;
    /** The number of columns to occupy. */
    cols: number;
}
/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getElement A callback to generate an element containing the details used in table rendering,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param precise A flag to control the method that cells are split; set to true to yeild an even number of splits for rows/columns.
 */
export declare function table<TRow extends Row>(cube: Cube<TRow>, axes: Axes<TRow>, getElement: Function<TRow, Element>, onX: boolean, precise?: boolean): Array<Array<Cell>>;
/**
 * Splits a cube of cells into a table, creating mutiple rows or columns where a cell in a cube has multiple values.
 * @hidden
 */
export declare function split<TRow extends Row>(cells: Cube<Cell>, axes: Axes<TRow>, onX: boolean, precise: boolean): Array<Array<Cell>>;
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export declare function merge(cells: Array<Array<Cell>>, onX: boolean, onY: boolean): void;
