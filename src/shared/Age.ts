import { InvalidParameterError } from "./CustomErrors";

export enum AgeCategory {
  CHILD = 'child',
  ADULT = 'adult',
  ELDERLY = 'elderly'
}

export class Age {
  private val: number;

  public constructor(val: number) {
    if (val <= 0) {
      throw new InvalidParameterError(`Age cannot be negative`);
    }
    this.val = val;
  }

  public valueOf() {
    return this.val;
  }
}