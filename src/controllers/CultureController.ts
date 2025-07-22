import { Culture } from "../dataTypes/DTOs/Culture";
import { Gender, Person } from "../dataTypes/DTOs/Person";
import { ApiResult} from "../dataTypes/Result";
import { CultureFactory } from "../domain/CultureService";

export class CultureController {
  constructor(private cultureFactory: CultureFactory) {}

  async generatePerson(cultureKey: string, occupation?: string, gender?: Gender) : Promise<ApiResult<Person>> {
    let service = this.cultureFactory.getCultureSource();
    return service.generatePerson(cultureKey, occupation, gender)
  }

  async getCulturesByKeys(keys: string[]): Promise<ApiResult<Culture[]>> {
    let service = this.cultureFactory.getCultureSource();
    if (keys.length == 0) {
      return await service.getAllCultures();
    }
    return await service.getCulturesByKeys(keys);
  }
}