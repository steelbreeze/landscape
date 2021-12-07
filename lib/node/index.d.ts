import { Function, Pair } from '@steelbreeze/types';
import { Axes, Cube } from '@steelbreeze/pivot';
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
export declare function setMode(value: (...values: Array<number>) => number): void;
/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param axes The x and y axes used in the pivot operation to create the cube.
 * @param getElement A callback to generate an element containing the details used in table rendering,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param precise A flag to control the method that cells are split; set to true to yeild an even number of splits for rows/columns.
 */
export declare function table<TRow>(cube: Cube<TRow>, axes: Axes<TRow>, getElement: Function<TRow, Element>, onX: boolean): Array<Array<Cell>>;
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export declare const merge: (cells: Array<Array<Cell>>, onX: boolean, onY: boolean) => void;
/**
 * Returns the least common multiple of a set of integers generated from an object.
 * @hidden
 */
export declare const leastCommonMultiple: (...counts: Array<number>) => number;
