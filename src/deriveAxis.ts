import { IAxis } from './IAxis';
import { IApplication } from './IApplication';

export function deriveAxis(applications: Array<IApplication>, name: string): IAxis {
	const values: Array<string> = [];

	for (const application of applications) {
		for (const use of application.usage) {
			const value = use.dimensions[name];

			if (values.indexOf(value) === -1) {
				values.push(value);
			}
		}
	}

	return { name, values };
}
