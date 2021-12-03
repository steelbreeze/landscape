import { Axes, Cube, Function, Pair, Row } from '@steelbreeze/pivot';
/** The final text and class name to use when rendering cells in a table. */
export interface StyledPair extends Pair {
    /** The class name to use in the final table rendering. */
    style: string;
}
/** An extension of key, adding the number of rows and columns the key will occupy in the final table rendering. */
export interface Cell<TRow extends Row> extends StyledPair {
    /** Unique keys for the source context. */
    index: Array<number>;
    /** The the rows that this this key came from. */
    source: Array<TRow>;
    /** The number of rows to occupy. */
    rows: number;
    /** The number of columns to occupy. */
    cols: number;
}
/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getKey A callback to generate a key containing the text and className used in the table from the source records,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param precise A flag to control the method that cells are split; set to true to yeild an even number of splits for rows/columns.
 */
export declare function table<TRow extends Row>(cube: Cube<TRow>, axes: Axes<TRow>, getKey: Function<TRow, StyledPair>, onX: boolean, precise?: boolean): Array<Array<Cell<TRow>>>;
/**
 * Splits a cube of keys into a table, creating mutiple rows or columns where a cell in a cube has multiple values.
 * @hidden
 */
export declare function split<TRow extends Row>(cells: Cube<Cell<TRow>>, axes: Axes<TRow>, onX: boolean, precise: boolean): Array<Array<Cell<TRow>>>;
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export declare function merge<TRow extends Row>(cells: Array<Array<Cell<TRow>>>, onX: boolean, onY: boolean): void;
