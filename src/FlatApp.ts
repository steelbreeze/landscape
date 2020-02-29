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

