import { IApplication } from './IApplication';
import { IDetail } from './IDetail';

/**
 * A denormalised representation of application data.
 * @hidden
 */
export interface FlatApp {
	detail: IDetail;
	status: string;
	usage: Array<{ x: string, y: string }>
}

/**
 * Denormalise the application data into an intermedia
 * @param applications 
 * @param x 
 * @param y 
 * @hidden
 */
export function flatten(applications: Array<IApplication>, x: string, y: string): Array<FlatApp> {
	// denormalise the underlying application data and resolve the axes
	let interim: Array<FlatApp> = [];

	for (const app of applications) {
		for (const use of app.usage) {
			let interimApp = interim.filter(a => a.detail.id === app.detail.id && a.status === use.status)[0];

			if (!interimApp) {
				interimApp = { detail: app.detail, status: use.status, usage: [] };

				interim.push(interimApp);
			}

			interimApp.usage.push({ x: use.dimensions[x], y: use.dimensions[y] });
		}
	}

	// delete single use app/status combinations as they cannot contribute to affinity score
	return interim.filter(app => app.usage.length > 1);
}