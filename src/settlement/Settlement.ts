import { PersonDto, PersonService } from "src/person/PersonService"
import { requiredOccupationMap, SettlementBracket, settlementSizeMap } from "./settlementData"
import { Name } from "src/shared/Name"
import { Culture } from "src/culture/Culture"
import { NameOption } from "src/nameOption/NameOption"
import { NameType } from "src/nameOption/NameType"
import { randomBetween } from "src/shared/choice"
import { Logger } from "@nestjs/common"

export class SettlementDto {
  public readonly name: string
  public readonly size: SettlementBracket
  public readonly population: number
  public readonly culture: string
  public readonly importantPeople: PersonDto[]
  constructor(name: string, culture: Culture, size: SettlementBracket, population: number, people: PersonDto[]) {
    this.name = name;
    this.importantPeople = people;
    this.culture = culture.name;
    this.population = population;
    this.size = size;
  }
}

export class SettlementInput {
  constructor(public size: SettlementBracket, public name?: string) {}
}

export async function createSettlement(culture: Culture, size: SettlementBracket, personService: PersonService, name?: string, logger: Logger = new Logger('createSettlement')): Promise<SettlementDto> {
  logger.debug(`culture has ${culture.settlementNames.length} settlement names and ${culture.personNames.length} person names`);
  let settlementName = name ?? culture.getRandomSettlementName().value
  let sizeRange = settlementSizeMap.get(size) ?? settlementSizeMap.get(SettlementBracket.VILLAGE)!
  let requiredOccupations = requiredOccupationMap.get(size) ?? [];
  let population = randomBetween(sizeRange.min, sizeRange.max);
  let people: PersonDto[] = []
  for (let occupation of requiredOccupations) {
    people.push(await personService.createPersonFromCulture(culture, occupation));
  }
  return new SettlementDto(settlementName, culture, size, population, people);
}