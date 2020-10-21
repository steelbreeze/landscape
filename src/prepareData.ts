import { Source, Dictionary, IKey, IKeyed } from './IApplication';
import { IAxis } from './IAxis';

/**
 * Structures and denormalises the application data aligned to a chosen pair of axes.
 * @param applications The application data to prepare.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @param getKey A callback to create a unique key for the reduction of applications into the cells.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
export function prepareData(source: Source, x: IAxis, y: IAxis, getKey: (detail: Dictionary) => IKey): Array<Array<Array<IKeyed & {source: Source}>>> {
	const result: Array<Array<Array<IKeyed & {source: Source}>>> = y.values.map(() => x.values.map(() => []));

	// denormalise and position each application within the correct table cell
	for (const app of source) {
			const key = getKey(app);
			const yIndex = y.values.indexOf(app[y.name]);
			const xIndex = x.values.indexOf(app[x.name]);
			const resApp = result[yIndex][xIndex].find(da => da.key.text === key.text && da.key.style === key.style);

			if (resApp) {
				resApp.source.push(app);
			} else {
				result[yIndex][xIndex].push({ key, source: [app] });
			}
	}

	return result;
}
