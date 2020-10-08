/**
 * An object whose properties are keyed by string and may all have a common type.
 */
export interface Properties<TProperty = unknown> {
	[key: string]: TProperty;	
}

/** A usage context of an application and its status. */
export interface IDimensions {
	/** The set of dimensions used to categorise this usage. */
	dimensions: Properties<string>;
}

/** The core details of an application. */
export interface IApplication {
	/** The meta data associated with the application. */
	detail: Properties;
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

/** The usage that an application can be put to. */
export interface IUsage {
	/** The data showing the application usage context over time. */
	usage: Array<IDimensions & IUseDetail>;
}

/** A user-defined key into the data for determining uniqueness */
export interface IKey {
	major: string;
	minor: string | undefined;
}
