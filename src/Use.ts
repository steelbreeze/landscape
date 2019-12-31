import { Dimensions } from './Dimensions';

/** A usage context of an application and its status. */
export interface Use extends Dimensions {
	commissioned: Date | undefined;

	decommissioned: Date | undefined;

	/** The status of an application. */
	status: "green" | "amber" | "red";
}
