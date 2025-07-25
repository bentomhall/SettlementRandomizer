import { Controller, Get, Post, Body, HttpCode } from "@nestjs/common";
import { LineageRepository } from "./lineage/LineageRepository";
import { GenderFrequency, Lineage, LineageOutput } from "./lineage/Lineage";
import { Gender } from "./lineage/Gender";

class LineageDto {
  name: string
  adultAge: number
  maximumAge: number
  elderlyAge: number
  genders: Record<string, number>
}

@Controller('lineages')
export class LineageController {
  constructor(private repo: LineageRepository){}
  @Get()
  async findAll(): Promise<LineageOutput[]> {
    return (await this.repo.getAll()).map(x => mapLineageToOutput(x))
  }

  @Post()
  @HttpCode(200)
  async create(@Body() body: LineageDto): Promise<LineageOutput> {
    let name = body.name;
    let adultAge = body.adultAge;
    let maximumAge = body.maximumAge;
    let elderlyAge = body.elderlyAge;
    let genders = body.genders;
    let genderFrequencies: GenderFrequency[] = [];
    for (let key in genders) {
      genderFrequencies.push(parseGenderInput(key, genders[key]))
    }
    let lineage = new Lineage({
      name,
      adultAge,
      maximumAge,
      elderlyAge,
      genders: genderFrequencies
    });
    lineage = await this.repo.upsert(lineage);
    return mapLineageToOutput(lineage)
  }
}

function mapLineageToOutput(l: Lineage): LineageOutput {
  return new LineageOutput(l.id, l.name.valueOf(), l.adultAge, l.maximumAge, l.elderlyAge, l.genders)
}

function parseGenderInput(key: string, value: number): GenderFrequency {
  switch (key) {
    case Gender.maleKey:
      return new GenderFrequency(Gender.male, value)
    case Gender.femaleKey:
      return new GenderFrequency(Gender.female, value)
    case Gender.neuterKey:
      return new GenderFrequency(Gender.neuter, value)
    default:
      return new GenderFrequency(Gender.other, value)
  }
}