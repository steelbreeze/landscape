import { Detail } from './Detail';
import { Use } from './Use';

/** An application and all the contexts in which it is used. */
export interface Application {
	/** The meta data associated with the application. */
	detail: Detail;

	/** The data showing the application usage context over time. */
	usage: Array<Use>;
}
