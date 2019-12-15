import { Application } from './Application';
import { Axes } from './Axes';
import { Dimension } from './Dimension';

/**
 * Returns the x and y axes for a given data set.
 * @param applications The applications data.
 * @param xDimension The dimension to use as the x axis.
 * @param yDimension The dimension to use as the y axis.
 * @returns Returns the x and y axes with their values.
 */
export function getAxes(applications: Array<Application>, xDimension: Dimension, yDimension: Dimension): Axes {
    const xValues: Array<string> = [];
    const yValues: Array<string> = [];

    for (const app of applications) {
        for (const use of app.usage) {
            const xValue = use[xDimension];
            const yValue = use[yDimension];

            if (xValues.indexOf(xValue) === -1) {
                xValues.push(xValue);
            }

            if (yValues.indexOf(yValue) === -1) {
                yValues.push(yValue);
            }
        }
    }

    return {xDimension, xValues, yDimension, yValues};
}
