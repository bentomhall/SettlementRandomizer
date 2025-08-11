import { Controller, Get, Post, Body, HttpCode, Delete, Param, Put, Inject } from "@nestjs/common";
import { Lineage, LineageDto, LineageOutput } from "./lineage/Lineage";
import { LineageService } from "./lineage/LineageService";

@Controller('lineages')
export class LineageController {
  constructor(private service: LineageService){}
  @Get()
  async findAll(): Promise<LineageOutput[]> {
    return (await this.service.findAll()).map(l => LineageOutput.fromLineage(l));
  }

  @Post()
  @HttpCode(200)
  async create(@Body() body: LineageDto): Promise<LineageOutput> {
    return LineageOutput.fromLineage(await this.service.create(body));
  }

  @Post("bulk")
  async createBulk(@Body() body: LineageDto[]): Promise<LineageOutput[]> {
    let output: Lineage[] = []
    for (let l of body) {
      output.push(await this.service.create(l));
    }
    return output.map(l => LineageOutput.fromLineage(l));
  }

  @Get(":id")
  async findOneById(@Param() id: number): Promise<LineageOutput> {
      return LineageOutput.fromLineage(await this.service.findById(id))
  }

  @Put(":id")
  async replaceLineage(@Body() body: LineageDto, @Param() id: number): Promise<LineageOutput> {
    return LineageOutput.fromLineage(await this.service.replace(body, id))
  }

  @Delete(":id")
  async deleteLineage(@Param() id: number): Promise<void> {
    return await this.service.deleteById(id);
  }
}