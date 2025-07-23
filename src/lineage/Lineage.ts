import { Age, AgeCategory } from "src/shared/Age";
import { InvalidOperationError, InvalidParameterError } from "src/shared/CustomErrors";
import { Name } from "src/shared/Name";
import { keyFromName } from "src/shared/StringUtils";

export interface LineageInput {
  name: string;
  adultAge: number;
  maximumAge: number;
  elderlyFraction?: number;
}

export class Lineage {
  #id: number;
  #name: Name;
  #adultAge: Age;
  #maximumAge: Age;
  #elderlyFraction: number = 0.8;

  constructor(input: LineageInput, id: number = -1) {
    if (input.elderlyFraction != null && (input.elderlyFraction <= 0 || input.elderlyFraction >= 1)) {
      throw new InvalidParameterError(`Lineage.elderlyFraction must be > 0 and < 1, got ${input.elderlyFraction}`);
    }
    this.#id = id;
    this.#name = new Name(input.name);
    this.#adultAge = new Age(input.adultAge);
    this.#maximumAge = new Age(input.maximumAge);
    this.#elderlyFraction = input.elderlyFraction ?? 0.8
  }

  public setId(value: number) {
    if (this.id != -1) {
      throw new InvalidOperationError(`Cannot set id to ${value}, already set to ${this.id}`);
    }
    this.#id = this.id;
  }

  public get id(): number {
    return this.#id;
  }

  public get name(): Name {
    return this.#name;
  }

  public get key(): string {
    return keyFromName(this.#name);
  }

  public ageCategory(age: Age): AgeCategory {
    if (age < this.#adultAge) {
      return AgeCategory.CHILD;
    } else if (age.valueOf() > this.#elderlyFraction*this.#maximumAge.valueOf()) {
      return AgeCategory.ELDERLY;
    }
    return AgeCategory.ADULT;
  }
}