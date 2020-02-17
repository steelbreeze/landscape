import { IAxis } from './IAxis';

export class Axis implements IAxis {
	public constructor(public readonly name: string, public readonly values: Array<string>) {}
}
