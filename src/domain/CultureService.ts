import { ok } from "../dataTypes/Result"
import { Repository, DataSource, In } from "typeorm";
import { CultureEntry } from "../dataTypes/CultureEntry";
import { Gender, Person } from "../dataTypes/DTOs/Person";
import { NotFoundError } from "../dataTypes/Errors";
import { ApiResult, err } from "../dataTypes/Result";
import { MockCultureSource } from "../test/Mocks";
import { Culture } from "../dataTypes/DTOs/Culture";

export interface CultureSource {
  generatePerson(cultureKey: string, occupation?: string, gender?: Gender): Promise<ApiResult<Person>>
  getAllCultures(): Promise<ApiResult<Culture[]>>
  getCulturesByKeys(keys: string[]): Promise<ApiResult<Culture[]>>
}

export interface CultureFactory {
  getCultureSource(): CultureSource
}

export class CultureSourceFactory implements CultureFactory {
  constructor(private dataSource: DataSource, private quirks: string[], private occupations: string[], private prod: boolean = true){}

  getCultureSource(): CultureSource {
    if (this.prod) {
      return new CultureService(this.dataSource.getRepository(CultureEntry), this.quirks, this.occupations)
    }
    return new MockCultureSource()
  }
}

export class CultureService implements CultureSource {
    constructor(private repo: Repository<CultureEntry>, private quirks: string[], private occupations: string[]) { 
      
    }
  
    async generatePerson(cultureKey: string, occupation?: string, gender?: Gender) : Promise<ApiResult<Person>> {
      let culture = await this.repo.findOneBy({
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

    async getAllCultures(): Promise<ApiResult<Culture[]>> {
      let cultures = await this.repo.find();
      return ok(cultures.map(x => Culture.fromCultureEntry(x)))
    }

    async getCulturesByKeys(keys: string[]): Promise<ApiResult<Culture[]>> {
      if (keys.length == 0) {
        return err(new NotFoundError("No keys provided"))
      }
      let cultures = await this.repo.findBy({
        key: In(keys),
      })
      return ok(cultures.map(x => Culture.fromCultureEntry(x)))
    }
}