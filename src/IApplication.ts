/** The core details of an application. */
export interface IApplication {
	/** The meta data associated with the application. */
	detail: IDetail;
}

/**
 * The meta data associated with an application excluding its usage context.
 * Note: this is designed to be enriched and no type erasure will occur within the landscape library.
 */
export interface IDetail {
	/** An identifier for the application. */
	id: string | number;

	/** The name of the application. */
	name: string;
}

export interface IUsage {
	/** The data showing the application usage context over time. */
	usage: Array<IDimensions & IUseDetail>;
}

/** A usage context of an application and its status. */
export interface IDimensions {
	/** The set of dimensions used to categorise this usage. */
	dimensions: { [key: string]: string };
}

/**
 * The details of when a usage context started, ended and its status.
 */
export interface IUseDetail {
	/** The status of an application in this usage context. */
	status: string;

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
}
