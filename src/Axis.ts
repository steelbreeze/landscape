import { IAxis } from './IAxis';
import { IApplication } from './IApplication';

/**
 * An axis to use to layout a landscape.
 */
export class Axis implements IAxis {
	/**
	 * Creates a new instance of the Axis class.
	 * @param name The name of the dimension to use as the axis.
	 * @param values An ordered set of the unique values of the dimension.
	 */
	public constructor(public readonly name: string, public readonly values: Array<string>) { }

	/**
	 * Derives an axis to be used in the map layout from underlying application data.
	 * @param applications The applications data.
	 * @param name The name of the dimension.
	 * @returns Returns the axis with its values.
	 */
	public static derive(applications: Array<IApplication>, name: string): Axis {
		const axis = new Axis(name, []);

		for (const application of applications) {
			for (const use of application.usage) {
				const value = use.dimensions[name];

				if (axis.values.indexOf(value) === -1) {
					axis.values.push(value);
				}
			}
		}

		return axis;
	}
}
