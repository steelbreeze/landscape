import { IDimensions } from './IDimensions';

/** A usage context of an application and its status. */
export interface IUse {
	/** The dimensions used to categorise the usage (this is extensible and additional fields will be passed though) */
	dimensions: IDimensions;

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

	/** The status of an application. */
	status: "green" | "amber" | "red";
}
