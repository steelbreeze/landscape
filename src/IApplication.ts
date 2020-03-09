// This file contains a set of interface fragments that can be composed into normalised or denormalised data structures for application data.
// This way, regadless of the way the information is structured, each field will only have a single definition
import { IDetail } from './IDetail';

/** An application and all the contexts in which it is used. */
export interface IApplicationDetail {
	/** The meta data associated with the application. */
	detail: IDetail;
}

export interface IApplicationUsage {
	/** The data showing the application usage context over time. */
	usage: Array<IDimensions & IApplicationUsageStatus>;
}

/** A usage context of an application and its status. */
export interface IDimensions {
	/** The set of dimensions used to categorise this usage. */
	dimensions: { [key: string]: string };
}

export interface IApplicationUsageStatus {
	/**
	 * The date this this particular application usage was commissioned.
	 * This is an optional field; undefined means that the origional commissioning date is unknown and therfore the beginning of time.
	 */
	commissioned: Date | undefined;

	/**
	 * The date this this particular application usage was decommissioned.
	 * This is an optional field; undefined means that the decommissioning date is unknown and therfore this application usage will continue to the end of time.
	 */
	decommissioned: Date | undefined;

	/** The status of an application in this usage context. */
	status: string;
}
