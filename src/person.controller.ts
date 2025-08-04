import { Body, Controller, Get, Logger, Query } from "@nestjs/common";
import { PersonDto, PersonService } from "./person/PersonService";

export class PersonInput {
  public occupation?: string;
  public minAge?: number;
  public maxAge?: number;
  public cultureId: number;
}

@Controller('people')
export class PersonController {
  private logger: Logger = new Logger('PersonController')
  public constructor(private service: PersonService) {}

  @Get()
  public async createPeople(@Body() input: PersonInput, @Query('count') count: number = 1): Promise<PersonDto[]> {
    let ageRange: [number, number] | undefined = undefined;
    if (input.minAge && input.maxAge) {
      ageRange = [input.minAge, input.maxAge];
    }
    let people: PersonDto[] = [];
    for (let i = 0; i < count; i++) {
      people.push(await this.service.createPerson(input.cultureId, input.occupation, ageRange))
    }
    return people;
  }
}