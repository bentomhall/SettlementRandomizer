import { InvalidParameterError } from "./CustomErrors"

export class Name {
  #value: string
  constructor(value: string) {
    if (value.trim().length == 0) {
      throw new InvalidParameterError(`Names must contain at least one non-whitespace character.`)
    }
    this.#value = value;
  }

  public valueOf(): string {
    return this.#value;
  }

  public get value(): string {
    return this.#value;
  }
}