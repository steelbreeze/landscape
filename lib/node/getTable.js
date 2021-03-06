"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTable = void 0;
/**
 * Returns a jagged two dimentional array ready for rendering on screen.
 * @param prepared The structured data having previously been prepared by a call to [prepareData].
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @param splitOnY When splitting and merging cells use this to split on the x or y axis.
 */
function getTable(prepared, x, y, splitOnY = true) {
    const result = [];
    // determine the number of rows and columns each cell need to be split into
    const appCounts = prepared.map(row => row.map(cell => cell.length || 1));
    // create the top row heading
    const topRow = [cell("", "xyAxis"), ...x.values.map(xValue => cell(xValue, "xAxis"))];
    if (splitOnY) {
        const rowSplits = appCounts.map(row => row.reduce(leastCommonMultiple, 1));
        result.push(topRow);
        // create the rows in the result table
        prepared.forEach((row, rowIndex) => {
            // add the rows to the resultant table
            for (let rowSplitIndex = rowSplits[rowIndex]; rowSplitIndex--;) {
                // add the y-axis row heading and its source data
                result.push([cell(y.values[rowIndex], "yAxis"), ...row.map((apps, columnIndex) => {
                        const app = apps[Math.floor(rowSplitIndex * appCounts[rowIndex][columnIndex] / rowSplits[rowIndex])];
                        return app ? cell(app.key.text, app.key.style, app.key.data, rowSplits[rowIndex]) : cell("", "", undefined, rowSplits[rowIndex]);
                    })]);
            }
        });
    }
    else {
        const colSplits = [1, ...appCounts[0].map((col, i) => appCounts.map(row => row[i]).reduce(leastCommonMultiple, 1))];
        let rr = [];
        topRow.forEach((app, index) => {
            for (let i = 0; i < colSplits[index]; i++) {
                rr.push(cell(app.text, app.style, app.data, 1, colSplits[index]));
            }
        });
        result.push(rr);
        prepared.forEach((row, rowIndex) => {
            const rr = [cell(y.values[rowIndex], "yAxis")];
            row.forEach((apps, colIndex) => {
                for (let i = 0; i < colSplits[colIndex + 1]; i++) {
                    const app = apps[Math.floor(i * appCounts[rowIndex][colIndex] / colSplits[colIndex + 1])];
                    rr.push(app ? cell(app.key.text, app.key.style, app.key.data, 1, colSplits[colIndex + 1]) : cell("", "", undefined, 1, colSplits[colIndex + 1]));
                }
            });
            result.push(rr);
        });
    }
    // merge adjacent cells
    let app, adjacent;
    // iterate through the cells, from the bottom right to top left
    for (let iY = result.length; iY--;) {
        for (let iX = result[iY].length; iX--;) {
            app = result[iY][iX];
            // try merge with cell above first
            if (iY && (adjacent = result[iY - 1][iX]) && (adjacent.text === app.text && adjacent.style === app.style && adjacent.cols === app.cols)) {
                // update the cell above to drop down into this cells space
                adjacent.rows += app.rows;
                adjacent.height += app.height;
                // remove this cell
                result[iY].splice(iX, 1);
            }
            // otherwise try cell to left
            else if (iX && (adjacent = result[iY][iX - 1]) && (adjacent.text === app.text && adjacent.style === app.style && adjacent.rows === app.rows)) {
                // update the cell left to spread across into this cells space
                adjacent.cols += app.cols;
                adjacent.width += app.width;
                // remove this cell
                result[iY].splice(iX, 1);
            }
        }
    }
    return result;
}
exports.getTable = getTable;
/**
 * Creates a cell for the output table
 * @hidden
 */
function cell(text, style, data = undefined, rowSplit = 1, colSplit = 1) {
    return { text, style, data, cols: 1, rows: 1, height: 1 / rowSplit, width: 1 / colSplit };
}
/**
 * Returns the least common multiple of two integers
 * @param a
 * @param b
 * @hidden
 */
function leastCommonMultiple(a, b) {
    return (a * b) / greatestCommonFactor(a, b);
}
/**
 * Returns the greatest common factor of two numbers
 * @param a
 * @param b
 * @hidden
 */
function greatestCommonFactor(a, b) {
    return b ? greatestCommonFactor(b, a % b) : a;
}
