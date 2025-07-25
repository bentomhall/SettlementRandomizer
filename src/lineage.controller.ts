import { Controller, Get, Post, Body, HttpCode, Delete, Param, NotFoundException, Put } from "@nestjs/common";
import { LineageRepository } from "./lineage/LineageRepository";
import { Lineage, LineageDto, LineageOutput } from "./lineage/Lineage";

@Controller('lineages')
export class LineageController {
  constructor(private repo: LineageRepository){}
  @Get()
  async findAll(): Promise<LineageOutput[]> {
    return (await this.repo.getAll()).map(x => LineageOutput.fromLineage(x))
  }

  @Post()
  @HttpCode(200)
  async create(@Body() body: LineageDto): Promise<LineageOutput> {
    let lineage = new Lineage(body.toInput());
    lineage = await this.repo.upsert(lineage);
    return LineageOutput.fromLineage(lineage);
  }

  @Get("/:id")
  async findOneById(@Param() id: number): Promise<Lineage> {
    let lineage = await this.repo.getOneById(id);
    if (!lineage) {
      throw new NotFoundException()
    }
    return lineage;
  }

  @Put("/:id")
  async replaceLineage(@Body() body: LineageDto, @Param() id: number): Promise<Lineage> {
    let lineage = await this.repo.getOneById(id);
    if (!lineage) {
      throw new NotFoundException();
    }
    await this.repo.deleteById(id);
    lineage = new Lineage(body.toInput())
    lineage = await this.repo.upsert(lineage);
    return lineage;
  }

  @Delete("/:id")
  async deleteLineage(@Param() id: number): Promise<void> {
    await this.repo.deleteById(id);
    return;
  }
}