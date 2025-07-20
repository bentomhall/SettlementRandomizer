import { DataSource, Repository } from "typeorm";
import { ApiResult, err, ok } from "../dataTypes/Result";
import { Lineage } from "../dataTypes/DTOs/Lineage";
import { LineageEntry } from "../dataTypes/LineageEntry";
import { HttpError, NotFoundError } from "../dataTypes/Errors";

export class LineageController{
  private repository: Repository<LineageEntry>;
  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(LineageEntry)
  }

  async getLineages(): Promise<ApiResult<Lineage[]>> {
    let lineages = await this.repository.find({})
    return ok(lineages.map(l => Lineage.fromEntity(l)))
  }

  async getSingleLineage(key: string): Promise<ApiResult<Lineage>> {
    let lineage = await this.repository.findOneBy({
      key: key
    })
    return lineage ? ok(Lineage.fromEntity(lineage!)) : err(new NotFoundError(`Lineage with name ${key} not found`))
  }

  async createLineage(l: Lineage): Promise<ApiResult<boolean>> {
    let entry = new LineageEntry()
    entry.adultAge = l.adultAge
    entry.maxAge = l.maximumAge
    entry.name = l.name
    entry.key = l.key
    try {
      this.repository.save(entry)
      return ok(true)
    } catch (error) {
      if (error instanceof Error) {
        return err(new HttpError(error.message, error))
      } else {
        return err(new HttpError(`${error}`))
      }
    }
  }
}