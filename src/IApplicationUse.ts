import { IDetail } from './IDetail';
/**
 * Data structure of denormalised application and usage data once x and y axes have been selected.
 */
export interface IApplicationUse {
	/** The meta data associated with the application. */
	detail: IDetail;

	/** The value of the chosen x axis. */
	xValue: string;

	/** The value of the chosen y axis. */
	yValue: string;
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
