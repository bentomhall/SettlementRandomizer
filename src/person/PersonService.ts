import { Injectable } from "@nestjs/common";
import { CultureService } from "src/culture/CultureService";
import { choice, randomBetween } from "src/shared/choice";
import { DataFileProvider, DataFileType } from "src/shared/dbProvider";

export class PersonDto {
  public constructor(public name: string, public gender: string, public lineage: string, public age: number, public ageCategory: string, public occupation: string, public quirks: string[], public cultureName: string) {}
}

@Injectable()
export class PersonService {
  private occupations: string[];
  private quirks: string[];
  public constructor(private cultureService: CultureService, private dataProvider: DataFileProvider) {}

  async createPerson(cultureId: number, occupation?: string, requestedAgeRange?: [number, number]): Promise<PersonDto> {
    if (!occupation) {
      let occupations = await this.dataProvider.getData(DataFileType.OCCUPATIONS);
      if (!this.occupations) {
        this.occupations = occupations;
      }
      occupation = choice(occupations);
    }
    let culture = await this.cultureService.findCulture(cultureId);
    let allQuirks = await this.dataProvider.getData(DataFileType.QUIRKS);
    if (!this.quirks) {
      this.quirks = allQuirks;
    }
    let name = culture.getRandomPersonName();
    let lineage = culture.getRandomLineage();
    let individualInfo = requestedAgeRange ? lineage.randomMember(requestedAgeRange[0], requestedAgeRange[1]) : lineage.randomMember();
    let quirkCount = randomBetween(1, 4);
    let quirks: string[] = []
    for (let i=0;i<quirkCount;i++) {
      quirks.push(choice(this.quirks))
    }
    return new PersonDto(
      name,
      individualInfo.gender.value,
      lineage.name.value,
      individualInfo.age.valueOf(),
      individualInfo.category,
      occupation,
      quirks,
      culture.name
    );
  }
}

