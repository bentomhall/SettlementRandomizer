import { Age, AgeCategory } from "src/shared/Age";
import { InvalidOperationError, InvalidParameterError } from "src/shared/CustomErrors";
import { Name } from "src/shared/Name";
import { keyFromName } from "src/shared/StringUtils";
import { Gender } from "./Gender";
import { randomBetween, rescaleFrequencies, weightedChoice, WeightedOption } from "src/shared/choice";

export class LineageDto {
  name: string
  adultAge: number
  maximumAge: number
  elderlyAge: number
  genders: Record<string, number>
}

export function createLineageInput(dto: LineageDto): LineageInput {
  let genderFrequencies: GenderFrequency[] = [];
    for (let key in dto.genders) {
      genderFrequencies.push(GenderFrequency.fromRawInput(key, dto.genders[key]))
    }
    return {
      name: dto.name,
      adultAge: dto.adultAge,
      maximumAge: dto.maximumAge,
      elderlyAge: dto.elderlyAge,
      genders: genderFrequencies
    }
}

export interface LineageInput {
  name: string;
  adultAge: number;
  maximumAge: number;
  elderlyAge: number;
  genders: GenderFrequency[]
}

export class LineageOutput {
  id: number;
  name: string
  adultAge: number
  maximumAge: number
  elderlyAge: number
  genders: Record<string, number>

  constructor(id: number, name: string, adultAge: number, maximumAge: number, elderlyAge: number, genders: GenderFrequency[]) {
    this.name = name;
    this.id = id;
    this.adultAge = adultAge;
    this.maximumAge = maximumAge;
    this.elderlyAge = elderlyAge;
    this.genders = {}
    for (let gender of genders) {
      this.genders[gender.gender.key] = gender.frequency
      }  
    }
    
    static fromLineage(l: Lineage): LineageOutput {
      return new LineageOutput(l.id, l.name.valueOf(), l.adultAge, l.maximumAge, l.elderlyAge, l.genders)
    }
}

export class GenderFrequency implements WeightedOption<Gender> {
  constructor(public gender: Gender, private freq: number) {}
  get value(): Gender {
    return this.gender
  }

  get frequency(): number {
    return this.freq;
  }

  clone(): GenderFrequency {
    return new GenderFrequency(this.gender, this.freq);
  }

  rescale(total: number): void {
    this.freq = this.freq / total;
  }

  public static fromRawInput(key: string, value: number): GenderFrequency {
    switch (key) {
    case Gender.maleKey:
      return new GenderFrequency(Gender.male, value)
    case Gender.femaleKey:
      return new GenderFrequency(Gender.female, value)
    case Gender.neuterKey:
      return new GenderFrequency(Gender.neuter, value)
    default:
      return new GenderFrequency(Gender.other, value)
  }
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
    this.#genders = rescaleFrequencies(input.genders)
  }

  public setId(value: number) {
    if (this.id != -1) {
      throw new InvalidOperationError(`Cannot set id to ${value}, already set to ${this.id}`);
    }
    this.#id = value;
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

  public get adultAge(): number {
    return this.#adultAge.valueOf();
  }

  public get maximumAge(): number {
    return this.#maximumAge.valueOf();
  }

  public get elderlyAge(): number {
    return this.#elderlyAge.valueOf();
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

  public randomMember(minAge: number = 1, maxAge: number = this.maximumAge - 1): {age: Age, category: AgeCategory, gender: Gender} {
    if (minAge < 1 || maxAge >= this.maximumAge) {
      throw new InvalidParameterError(`Ages provided are out of bounds, must be (1, ${this.maximumAge})`)
    }
    let age = new Age(randomBetween(minAge, maxAge));
    let category = this.ageCategory(age)!;
    let gender = weightedChoice(this.#genders)!;
    return {
      age,
      category,
      gender
    }
  }
}