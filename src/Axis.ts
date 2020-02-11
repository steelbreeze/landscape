import { IAxis } from './IAxis';
import { Dimension } from './Dimension';

export class Axis implements IAxis {
	public constructor(public readonly name: Dimension, public readonly values: Array<string>) {}
}
