import { Injectable, NotFoundException } from "@nestjs/common";
import { CultureRepository } from "./CultureRepository";
import { Culture, NameFrequency } from "./Culture";
import { InvalidOperationError } from "src/shared/CustomErrors";
import { NameOption } from "src/nameOption/NameOption";
import { Lineage } from "src/lineage/Lineage";

@Injectable()
export class CultureService {
  constructor(private repo: CultureRepository) {}

  async findCulture(id: number): Promise<Culture> {
    return await this.repo.getById(id);
  }

  async findAll(): Promise<Culture[]> {
    return await this.repo.getAll();
  }

  async create(culture: Culture): Promise<Culture> {
    if (culture.id != -1) {
      throw new InvalidOperationError(`Cannot create culture with existing id`);
    }
    return await this.repo.upsert(culture);
  }

  async deleteById(id: number): Promise<void> {
    return await this.repo.deleteById(id);
  }

  async getSettlementName(cultureId: number): Promise<NameOption> {
    let culture = await this.repo.getById(cultureId);
    return culture.getRandomSettlementName();
  }

  async getPersonInfo(cultureId: number): Promise<{name: string, lineage: Lineage}> {
    let culture = await this.repo.getById(cultureId);
    let lineage = culture.getRandomLineage();
    let info = lineage.randomMember();
    return {
      name: culture.getRandomPersonName(info.gender),
      lineage: lineage
    }
  }

  async addNameToCulture(cultureId: number, name: NameFrequency): Promise<Culture> {
    if (!this.repo.exists(cultureId)) {
      throw new NotFoundException(`No culture with id ${cultureId} found`);
    }
    return await this.repo.addName(name, cultureId);
  }
}