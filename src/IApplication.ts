import { IDetail } from './IDetail';
import { IUse } from './IUse';

/** An application and all the contexts in which it is used. */
export interface IApplication {
	/** The meta data associated with the application. */
	detail: IDetail;

	/** The data showing the application usage context over time. */
	usage: Array<IUse>;
}
