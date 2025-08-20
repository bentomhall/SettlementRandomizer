import { PersonDto, PersonService } from "src/person/PersonService"
import { requiredOccupationMap, SettlementBracket, settlementSizeMap } from "./settlementData"
import { Culture } from "src/culture/Culture"
import { randomBetween, WeightedOption } from "src/shared/choice"
import { Lineage } from "src/lineage/Lineage"

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
  let {adjusted, individuals} = getRandomizedPopulationDemographics(population, culture.demographics);
  return new SettlementDto(settlementName, culture, size, adjusted, people, individuals);
}

export function getRandomizedPopulationDemographics(total: number, demographics: WeightedOption<Lineage>[], variation: number = 0.01): {adjusted: number, individuals: string[]}{
  let output: string[] = [];
  if (total < 1 || demographics.length == 0) {
    return {adjusted: total, individuals: output};
  }
  let current = total;
  let remaining = 1;
  let runningSum = 0;
  for (let l of demographics) {
    let f = l.frequency / remaining;
    remaining -= l.frequency;
    let pop = Math.floor(f * current*(1 + variation*(Math.random() - 0.5)));
    runningSum += pop
    current -= pop;
    output.push(`${l.value.name.value}: ${pop}`);
  }

  return {adjusted: runningSum, individuals: output};
}