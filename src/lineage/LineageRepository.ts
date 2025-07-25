import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { GenderFrequency, Lineage } from "./Lineage";
import { Gender } from "./Gender";
import { InvalidOperationError } from "src/shared/CustomErrors";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class LineageRepository {
  private baseQuery = `SELECT 
      l.id, l.name, adultAge, maxAge, elderlyAge, 
      g.id as g_id, g.key as g_key, g.label as g_label,
      lg.frequency as g_freq 
      FROM lineage l 
      JOIN lineage_gender_frequency lg
        ON lg.lineage_id = l.id
      JOIN gender g
        ON g.id = lg.gender_id`
  constructor(@Inject('POOL') private pool: Pool) {}
  async getOneById(id: number): Promise<Lineage | null> {
    let query = `${this.baseQuery}
      WHERE id = ?
      GROUP BY l.id;`
    let lineages: LineageGenderRow[] = await this.pool.execute<RowDataPacket[]>(query, [id])[0];
    if (lineages.length == 0) {
      return null;
    }
    let genderFrequencies: GenderFrequency[] = lineages.map(x => LineageMapper.toGenderFrequency(x));
    let first = lineages[0];
    return LineageMapper.toLineage(first, genderFrequencies);
  }

  async getAll(): Promise<Lineage[]> {
    let query = `${this.baseQuery} WHERE 1 GROUP BY l.id`
    let rows: LineageGenderRow[] = await this.pool.execute<RowDataPacket[]>(query)[0];
    let rowMap: Map<number, LineageGenderRow[]> = new Map()
    for (let row of rows) {
      let existing = rowMap.get(row.id) ?? []
      existing.push(row)
      rowMap.set(row.id, existing)
    }
    let output: Lineage[] = []
    for (let [key, rowsPerLineage] of rowMap) {
      let first = rowsPerLineage[0]
      let genders = rowsPerLineage.map(x => LineageMapper.toGenderFrequency(x))
      output.push(LineageMapper.toLineage(first, genders));
    }
    return output;
  }

  async upsert(lineage: Lineage): Promise<Lineage> {
    if (lineage.id != -1) {
      throw new InvalidOperationError(`Updates to lineages not supported at this time`);
    } else {
      return await this.insert(lineage);
    }
  }

  async deleteById(id: number): Promise<void> {
    let lineageQuery = `DELETE FROM lineage WHERE id=?;`
    await this.pool.query(lineageQuery, [id]);
  }

  private async insert(lineage:Lineage): Promise<Lineage> {
    let lineageQuery = `INSERT INTO lineage (name, adultAge, maximumAge, elderlyAge) VALUES (?, ?, ?, ?)`;
    let results = await this.pool.query<ResultSetHeader>(lineageQuery, [lineage.name, lineage.adultAge, lineage.maximumAge, lineage.elderlyAge]);
    let id = results[0].insertId
    lineage.setId(id)
    let genderQuery = `INSERT INTO lineage_gender_frequency (lineage_id, gender_id, frequency) VALUES (?, ?, ?);`
    for (let g of lineage.genders) {
      await this.pool.query(genderQuery, [id, g.gender.id, g.frequency])
    }
    return lineage
  }
}

interface LineageGenderRow {
  id: number,
  name: string,
  adultAge: number,
  maxAge: number,
  elderlyAge: number,
  g_id: number,
  g_key: string,
  g_label: string,
  g_freq: number
}

interface GenderRow {
  id: number,
  key: string,
  label: string
}

class LineageMapper {
  static toLineage(l: LineageGenderRow, g: GenderFrequency[]): Lineage {
    return new Lineage({
      genders: g,
      name: l.name,
      adultAge: l.adultAge,
      maximumAge: l.maxAge,
      elderlyAge: l.elderlyAge
    }, l.id)
  }

  static toGenderFrequency(l: LineageGenderRow): GenderFrequency {
    let gender = new Gender(l.g_id, l.g_key, l.g_label);
    return new GenderFrequency(gender, l.g_freq)
  }
}