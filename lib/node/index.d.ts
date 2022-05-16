import { Callback, FunctionVA, Pair } from '@steelbreeze/types';
import { Axes, Cube } from '@steelbreeze/pivot';
/** The styling to add to a key value pair when rendering. */
export interface Style {
    /** The class name to use in the final table rendering. */
    style: string;
    /** Optional alternative text to display in place of Pair.value (which is used to de-dup); this should have a single value for any given Pair.value. */
    text?: string;
}
/** The layout information used to determine how many rows and columns a cell needs to occupy. */
export interface Layout {
    /** The number of rows to occupy. */
    rows: number;
    /** The number of columns to occupy. */
    cols: number;
}
/** An element derived from a row of data. */
export declare type Element = Pair & Style;
/** An element ready for rendering as a table cell. */
export declare type Cell = Element & Layout;
/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getElement A callback to generate an element containing the details used in table rendering,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param method A function used to calculate how many rows or columns to split a row/column into based on the number of entries in each cell of that row/column. Defaults to Math.max, but other methods such as Least Common Multiple can be used for more precise table rendering.
 */
export declare const table: <TRow>(cube: Cube<TRow>, axes: Axes<TRow>, getElement: Callback<TRow, Element>, onX: boolean, method?: FunctionVA<number, number>) => Array<Array<Cell>>;
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export declare const merge: (cells: Array<Array<Cell>>, onX: boolean, onY: boolean) => void;
