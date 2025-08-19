import { PersonDto, PersonService } from "src/person/PersonService"
import { requiredOccupationMap, SettlementBracket, settlementSizeMap } from "./settlementData"
import { Culture } from "src/culture/Culture"
import { randomBetween } from "src/shared/choice"

export class SettlementDto {
  public readonly name: string
  public readonly size: SettlementBracket
  public readonly population: number
  public readonly culture: string
  public readonly importantPeople: PersonDto[]
  public readonly demographics: string[]
  constructor(name: string, culture: Culture, size: SettlementBracket, population: number, people: PersonDto[], demographics: string[]) {
    this.name = name;
    this.importantPeople = people;
    this.culture = culture.name;
    this.population = population;
    this.size = size;
    this.demographics = demographics;
  }
}

export class SettlementInput {
  constructor(public size: SettlementBracket, public name?: string) {}
}

export async function createSettlement(culture: Culture, size: SettlementBracket, personService: PersonService, name?: string): Promise<SettlementDto> {
  let settlementName = name ?? culture.getRandomSettlementName().value
  let sizeRange = settlementSizeMap.get(size) ?? settlementSizeMap.get(SettlementBracket.VILLAGE)!
  let requiredOccupations = requiredOccupationMap.get(size) ?? [];
  let population = randomBetween(sizeRange.min, sizeRange.max);
  let people: PersonDto[] = []
  for (let occupation of requiredOccupations) {
    people.push(await personService.createPersonFromCulture(culture, occupation, undefined, true));
  }
  let demographics = culture.demographics.map(x => { return `${x.value.name}: ${Math.floor(population * x.frequency)}`})
  return new SettlementDto(settlementName, culture, size, population, people, demographics);
}