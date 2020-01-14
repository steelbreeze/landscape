/**
 * The dimensions of use that we may record against an application.
 */
export interface IDimensions {
	/** A product, or family of products that the application processes. */
	product: string;

	/** A functional capability implemented by the application. */
	capability: string;

	/** The location in which the application is used. */
	location: string;
}
