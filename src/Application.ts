import { Use } from './Use';

/** An application and all the contexts in which it is used. */
export interface Application {
	/** The name of the application. */
	name: string;

	/** The usage context of the application. */
	usage: Array<Use>;
}
