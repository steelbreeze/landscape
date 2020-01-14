import { IDetail } from './IDetail';
/**
 * An implementation of the IDetail interface, for application detail generated within the library.
 * @hidden
 */
export class Detail implements IDetail {
	/**
	 * Creates an instance of the Detail class.
	 * @param id The application id.
	 * @param name The application name.
	 */
	public constructor (public readonly id: string | number = "", public readonly name: string = "") { }	
}
