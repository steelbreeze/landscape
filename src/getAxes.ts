import { Application } from './Application';
import { Axis } from './Axis';
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
    const x: Axis = { dimension: xDimension, values: [] };
    const y: Axis = { dimension: yDimension, values: [] };

    for (const app of applications) {
        for (const use of app.usage) {
            const xValue = use[x.dimension];
            const yValue = use[y.dimension];

            if (x.values.indexOf(xValue) === -1) {
                x.values.push(xValue);
            }

            if (y.values.indexOf(yValue) === -1) {
                y.values.push(yValue);
            }
        }
    }

    return { x, y };
}
