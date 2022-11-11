import { Callback, FunctionVA, Pair, Predicate } from '@steelbreeze/types';
import { Cube } from '@steelbreeze/pivot';
/** Specialised criteria for landscape maps. */
export declare type Criteria<TRecord> = Predicate<TRecord> & {
    metadata: Array<Pair<keyof TRecord, TRecord[keyof TRecord]>>;
};
export declare type Dimension<TRecord> = Array<Criteria<TRecord>>;
/** Styling information for rendering purposes. */
export interface Style {
    /** The class name to use in the final table rendering. */
    style: string;
    /** Optional text to display in place of Pair.value (which is used to de-dup); this should have a single value for any given Pair.value. */
    text?: string;
}
/** Table layout for rendering purposes. */
export interface Layout {
    /** The number of rows to occupy. */
    rows: number;
    /** The number of columns to occupy. */
    cols: number;
}
/** The final text and class name to use when rendering cells in a table. */
export declare type Element = Pair<string | number, any> & Style;
/** An extension of Element, adding the number of rows and columns the element will occupy in the final table rendering. */
export declare type Cell = Element & Layout;
/**
 * Default criteria creator with simple metadata.
 * @param key The property within the source data to use as
 */
export declare const criteria: <TRecord>(key: keyof TRecord) => Callback<TRecord[keyof TRecord], Criteria<TRecord>>;
/**
 * Generates a table from a cube and it's axis.
 * @param cube The source cube.
 * @param y The y axis used in the pivot operation to create the cube.
 * @param x The x axis used in the pivot operation to create the cube.
 * @param getElement A callback to generate an element containing the details used in table rendering,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 * @param method A function used to calculate how many rows or columns to split a row/column into based on the number of entries in each cell of that row/column. Defaults to Math.max, but other methods such as Least Common Multiple can be used for more precise table rendering.
 */
export declare const table: <TRecord>(cube: Cube<TRecord>, y: Dimension<TRecord>, x: Dimension<TRecord>, getElement: Callback<TRecord, Element>, onX: boolean, method?: FunctionVA<number, number>) => Array<Array<Cell>>;
/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param cells A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export declare const merge: (cells: Array<Array<Cell>>, onX: boolean, onY: boolean) => void;
