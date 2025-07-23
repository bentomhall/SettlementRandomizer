import { Age, AgeCategory } from "src/shared/Age";
import { InvalidOperationError, InvalidParameterError } from "src/shared/CustomErrors";
import { Name } from "src/shared/Name";
import { keyFromName } from "src/shared/StringUtils";
import { Gender, genderKeyMap } from "./Gender";
import { WeightedOption } from "src/shared/choice";

export interface LineageInput {
  name: string;
  adultAge: number;
  maximumAge: number;
  elderlyAge: number;
  genders: Map<Gender, number>
}

export class GenderFrequency implements WeightedOption<GenderFrequency> {
  constructor(public key: string, public gender: string, private freq: number) {}
  get value(): GenderFrequency {
    return this
  }

  get frequency(): number {
    return this.freq;
  }

  clone(): GenderFrequency {
    return new GenderFrequency(this.key, this.gender, this.freq);
  }
}

export class Lineage {
  #id: number;
  #name: Name;
  #adultAge: Age;
  #maximumAge: Age;
  #elderlyAge: Age;
  #genders: GenderFrequency[] = []

  constructor(input: LineageInput, id: number = -1) {
    if (input.elderlyAge <= input.adultAge || input.elderlyAge >= input.maximumAge) {
      throw new InvalidParameterError(`Lineage.elderlyAge must be strictly between adultAge and maxAge, got ${input.elderlyAge}`);
    }
    if (input.adultAge >= input.maximumAge) {
      throw new InvalidParameterError(`Lineage.adultAge must be strictly less than input.maximumAge`);
    }
    this.#id = id;
    this.#name = new Name(input.name);
    this.#adultAge = new Age(input.adultAge);
    this.#maximumAge = new Age(input.maximumAge);
    this.#elderlyAge = new Age(input.elderlyAge);
    let total = Array.from(input.genders.values()).reduce((p, c) => p+c);
    for (let [key, v] of input.genders) {
      this.#genders.push(new GenderFrequency(genderKeyMap.get(key)!, key, v/total));
    }
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

  public ageCategory(age: Age): AgeCategory | null {
    if (age < this.#adultAge) {
      return AgeCategory.CHILD;
    } else if (age.valueOf() >= this.#elderlyAge.valueOf()) {
      return AgeCategory.ELDERLY;
    } else if (age.valueOf() >= this.#maximumAge.valueOf()) {
      return null;
    }
    return AgeCategory.ADULT;
  }

  public get genders(): GenderFrequency[] {
    return this.#genders.map(g => g.clone());
  }
}