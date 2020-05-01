import { IAxes } from './IAxes';
import { IUsage } from './IApplication';

/**
 * Extracts the list of unique values for a dimension from underlying application data.
 * @param applications The underlying application data.
 * @param x The name of the dimension to use as the x axis.
 * @param y The name of the dimension to use as the y axis.
 * @returns Returns an [IAxes] structure containing x and y axes.
 * @deprecated Migrate to [deriveDimensions].
 */
export function deriveAxes(applications: Array<IUsage>, x: string, y: string): IAxes {
	const xValues: Array<string> = [];
	const yValues: Array<string> = [];

	for (const application of applications) {
		for (const use of application.usage) {
			const xValue = use.dimensions[x];
			const yValue = use.dimensions[y];

			if (xValues.indexOf(xValue) === -1) {
				xValues.push(xValue);
			}

			if (yValues.indexOf(yValue) === -1) {
				yValues.push(yValue);
			}
		}
	}

	return { x: { name: x, values: xValues }, y: { name: y, values: yValues } };
}
