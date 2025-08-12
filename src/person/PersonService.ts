import { Injectable } from "@nestjs/common";
import { Culture } from "src/culture/Culture";
import { CultureService } from "src/culture/CultureService";
import { SizeRange } from "src/settlement/settlementData";
import { choice, randomBetween } from "src/shared/choice";
import { DataFileProvider, DataFileType } from "src/shared/dbProvider";

export class PersonDto {
  public constructor(public name: string, public gender: string, public lineage: string, public age: number, public ageCategory: string, public occupation: string, public quirks: string[], public cultureName: string) {}
}

export class PersonInput {
  public occupation?: string;
  public ageRange: SizeRange;
  public cultureId: number;
}

@Injectable()
export class PersonService {
  private occupations: string[];
  private quirks: string[];
  public constructor(private dataProvider: DataFileProvider) {}

  public async createPersonFromCulture(culture: Culture, occupation?: string, requestedAgeRange?: SizeRange): Promise<PersonDto> {
    if (!occupation) {
      let occupations = await this.dataProvider.getData(DataFileType.OCCUPATIONS);
      if (!this.occupations) {
        this.occupations = occupations;
      }
      occupation = choice(occupations);
    }
    
    let allQuirks = await this.dataProvider.getData(DataFileType.QUIRKS);
    if (!this.quirks) {
      this.quirks = allQuirks;
    }
    let lineage = culture.getRandomLineage();
    let individualInfo = requestedAgeRange ? lineage.randomMember(requestedAgeRange.min, requestedAgeRange.max) : lineage.randomMember();
    let name = culture.getRandomPersonName(individualInfo.gender);
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

