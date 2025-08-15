import { Body, Controller, Delete, Get, Logger, Param, Post, Query } from "@nestjs/common";
import { CultureService } from "./culture/CultureService";
import { Culture, CultureDto } from "./culture/Culture";
import { NameService } from "./nameOption/NameService";
import { LineageService } from "./lineage/LineageService";
import { createSettlement, SettlementDto } from "./settlement/Settlement";
import { PersonDto, PersonService } from "./person/PersonService";
import { SettlementBracket } from "./settlement/settlementData";

class CultureOutput{
  constructor(public readonly id: number, public readonly name: string, public readonly nameTemplate: string, public readonly personNames: Record<number, number>, public readonly settlementNames: string[], public lineages: Record<number, number>) {}

  public static fromCulture(c: Culture): CultureOutput {
    let personNames: Record<string, number> = {}
    for (let name of c.personNames) {
      personNames[name.value.value] = name.frequency;
    }
    let settlementNames: string[] = []
    for (let name of c.settlementNames) {
      settlementNames.push(name.value.value)
    }
    let lineages: Record<string, number> = {}
    for (let lineage of c.demographics) {
      lineages[lineage.value.name.value] = lineage.frequency;
    }
    return new CultureOutput(c.id, c.name, c.nameTemplate, personNames, settlementNames, lineages);
  } 
}

@Controller('cultures')
export class CultureController{
  private logger: Logger = new Logger(CultureController.name)
  constructor(private service: CultureService, private nameService: NameService, private lineageService: LineageService, private personService: PersonService) {}

  @Get()
  async findAll(): Promise<CultureOutput[]> {
    try {
      return (await this.service.findAll()).map(x => CultureOutput.fromCulture(x))
    } catch (error) {
      this.logger.error((error as Error).message ?? error, (error as Error).stack ?? 'no stack')
      throw error
    }
    
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CultureOutput> {
    return CultureOutput.fromCulture(await this.service.findCulture(id))
  }

  @Delete(':id')
  async deleteCulture(@Param('id') id: number): Promise<void> {
    await this.service.deleteById(id);
  }

  @Post()
  async createCulture(@Body() dto: CultureDto): Promise<CultureOutput> {
    
    let allNames = await this.nameService.getAllByType('ALL')
    let allLineages = await this.lineageService.findAll()

    let newCulture = Culture.fromDto(dto, allLineages, allNames);
    newCulture = await this.service.create(newCulture);
    return CultureOutput.fromCulture(newCulture);
  }

  @Get(':id/settlement')
  async createRandomSettlement(@Query('size') size: SettlementBracket, @Query('name') name: string | undefined, @Param('id') id: number): Promise<SettlementDto> {
    let culture = await this.service.findCulture(id);
    return await createSettlement(culture, size, this.personService, name);
  }

  @Get(':id/person')
  async createPerson(@Param('id') id: number, @Query('occupation') occupation: string | undefined, @Query('ageMax') ageMax: number = 200, @Query('ageMin') ageMin: number = 1): Promise<PersonDto> {
    let culture = await this.service.findCulture(id);
    return await this.personService.createPersonFromCulture(culture, occupation, {min: ageMin, max: ageMax})
  }
}