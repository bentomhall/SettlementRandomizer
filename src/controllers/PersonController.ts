import { DataSource } from "typeorm";
import { Gender, Person } from "../dataTypes/DTOs/Person";
import { CultureEntry } from "../dataTypes/CultureEntry";
import { NotFoundError } from "../dataTypes/Errors";
import { ApiResult, err, ok } from "../dataTypes/Result";

export class PersonController {
  constructor(private dataSource: DataSource, private quirks: string[], private occupations: string[]) { }

  async generatePerson(cultureKey: string, occupation?: string, gender?: Gender) : Promise<ApiResult<Person>> {
    let culture = await this.dataSource.manager.findOneBy(CultureEntry, {
      key: cultureKey
    });
    if (!culture) {
      return err(new NotFoundError('No culture with that id found'))
    }
    let nameEntry = culture.generateName()
    let lineageEntry = culture.generateLineage()
    let quirk = choice<string>(this.quirks)
    if (!gender) {
      gender = choice<Gender>([Gender.Female, Gender.Male, Gender.Other])
    }
    if (!occupation) {
      occupation = choice<string>(this.occupations);
    }
    let person = new Person(nameEntry.name, lineageEntry.name, lineageEntry.generateAge(occupation), occupation, quirk, gender)
    return ok(person)
  }
}