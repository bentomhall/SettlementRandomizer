import { Gender, Person } from "../dataTypes/DTOs/Person";
import { HttpError } from "../dataTypes/Errors";
import { ApiResult, err } from "../dataTypes/Result";
import { CultureSource } from "../domain/CultureService";

export class MockCultureSource implements CultureSource {
  async generatePerson(cultureKey: string, occupation?: string, gender?: Gender): Promise<ApiResult<Person>> {
    return err(new HttpError('Not implemented'))
  }
}