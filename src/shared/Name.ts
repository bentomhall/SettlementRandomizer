import { InvalidParameterError } from "./CustomErrors"

export class Name {
  private value: string
  constructor(value: string) {
    if (value.trim().length == 0) {
      throw new InvalidParameterError(`Names must contain at least one non-whitespace character.`)
    }
    this.value = value;
  }

  public valueOf(): string {
    return this.value;
  }
}