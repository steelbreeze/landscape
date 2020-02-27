import { IDetail } from './IDetail';

/** An application and all the contexts in which it is used. */
export interface IApplication<TUsage> {
	/** The meta data associated with the application. */
	detail: IDetail;

	/** The data showing the application usage context over time. */
	usage: Array<TUsage>;
}
