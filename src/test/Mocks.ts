import { Culture } from "../dataTypes/DTOs/Culture";
import { Gender, Person } from "../dataTypes/DTOs/Person";
import { HttpError } from "../dataTypes/Errors";
import { ApiResult, err, ok } from "../dataTypes/Result";
import { CultureSource } from "../domain/CultureService";

export class MockCultureSource implements CultureSource {
  async generatePerson(cultureKey: string, occupation?: string, gender?: Gender): Promise<ApiResult<Person>> {
    return err(new HttpError('Not implemented'))
  }
  async getAllCultures(): Promise<ApiResult<Culture[]>> {
    return ok([])
  }

  async getCulturesByKeys(keys: string[]): Promise<ApiResult<Culture[]>> {
    if (keys.length == 0) {
      return err(new HttpError('Must include at least one key'))
    }
    return ok([])
  }
}