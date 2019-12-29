import { Application } from './Application';
import { Axis } from './Axis';
import { Dimension } from './Dimension';

/**
 * Returns the unique set of values within an application data set for a given dimension.
 * @param applications The applications data.
 * @param name The name of the dimension.
 * @returns Returns the axis with its values.
 */
export function getAxis(applications: Array<Application>, name: Dimension): Axis {
    const values: Array<string> = [];

    for (const app of applications) {
        for (const use of app.usage) {
            const value = use[name];

            if (values.indexOf(value) === -1) {
                values.push(value);
            }
        }
    }

    return { name, values };
}
