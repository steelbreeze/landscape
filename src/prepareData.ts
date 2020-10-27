// @steelbreeze/landscape
// Copyright (c) 2019 David Mesquita-Morris
import { Tabular } from './Tabular';
import { IKey } from './IKey';
import { IKeyed } from './IKeyed';
import { IAxis } from './IAxis';

/**
 * Structures and denormalises the source data aligned to a chosen pair of axes.
 * @param tabular The source data to prepare.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @param getKey A callback to create a unique key for the reduction of applications into the cells.
 * @returns Returns a 2D array representing the chosen axis; each cell containing an array of the applications used in that context.
 */
export function prepareData(tabular: Tabular, x: IAxis, y: IAxis, getKey: (detail: Record<string, unknown>) => IKey): Array<Array<Array<IKeyed & {source: Tabular}>>> {
	const result: Array<Array<Array<IKeyed & {source: Tabular}>>> = y.values.map(() => x.values.map(() => []));

	// denormalise and position each record within the correct table cell
	for (const app of tabular) {
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
