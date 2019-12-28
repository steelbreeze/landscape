import { Application } from './Application';
import { Axis } from './Axis';
import { Dimension } from './Dimension';

/**
 * Returns the unique set of values within an application data set for a given dimension.
 * @param applications The applications data.
 * @param dimension The dimension to use as the y axis.
 * @returns Returns the axis with its values.
 */
export function getAxis(applications: Array<Application>, dimension: Dimension): Axis {
    const result: Axis = { name: dimension, values: [] };

    for (const app of applications) {
        for (const use of app.usage) {
            const value = use[dimension];

            if (result.values.indexOf(value) === -1) {
                result.values.push(value);
            }
        }
    }

    return result;
}
