import { IDimensions } from './IDimensions';

/** A usage context of an application and its status. */
export interface IUse extends IDimensions {
	commissioned: Date | undefined;

	decommissioned: Date | undefined;

	/** The status of an application. */
	status: "green" | "amber" | "red";
}
