import { Body, Controller, Delete, Get, Logger, Param, Post } from "@nestjs/common";
import { CultureService } from "./culture/CultureService";
import { Culture, CultureDto } from "./culture/Culture";
import { NameOptions, NameService, nameTypeOptions } from "./nameOption/NameService";
import { LineageService } from "./lineage/LineageService";

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
  constructor(private service: CultureService, private nameService: NameService, private lineageService: LineageService) {}

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
  async findOne(@Param() id: number): Promise<CultureOutput> {
    return CultureOutput.fromCulture(await this.service.findCulture(id))
  }

  @Delete(':id')
  async deleteCulture(@Param() id: number): Promise<void> {
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
}