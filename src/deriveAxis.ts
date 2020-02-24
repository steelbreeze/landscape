import { IAxis } from './IAxis';
import { IApplication } from './IApplication';

export function deriveAxis(applications: Array<IApplication>, name: string): IAxis {
	const axis: IAxis = { name, values: [] };

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
