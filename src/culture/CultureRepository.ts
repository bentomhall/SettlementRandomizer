import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { FieldPacket, Pool, ResultSetHeader } from "mysql2/promise";
import { LineageRepository } from "src/lineage/LineageRepository";
import { NameRepository } from "src/nameOption/NameRepository";
import { DatabaseProvider, groupRowsById, IdentifiableRow } from "src/shared/dbProvider";
import { Culture, CultureDto, LineageFrequency, NameFrequency } from "./Culture";
import { NameOption } from "src/nameOption/NameOption";
import { Lineage } from "src/lineage/Lineage";
import { NameType } from "src/nameOption/NameType";

@Injectable()
export class CultureRepository {
  pool: Pool
  logger: Logger = new Logger(CultureRepository.name)
  constructor(db: DatabaseProvider, private nameRepo: NameRepository, private lineageRepo: LineageRepository) {
    this.pool = db.pool;
  }

  private baseQuery = `SELECT
      c.id, c.name, c.name_template
      lf.lineage_id, lf.frequency as lineage_frequency,
      nf.name_id, nf.frequency as name_frequency
    FROM culture c
    JOIN culture_lineage_frequency lf
      ON lf.culture_id = c.id
    JOIN culture_name_frequency nf
      ON nf.culture_id = c.id
  `;

  async getById(id: number): Promise<Culture> {
    let query = `${this.baseQuery} WHERE c.id = ?;`;
    let rows: CultureRow[] = await this.pool.execute(query, [id])[0];
    if (rows.length == 0) {
      throw new NotFoundException(`No culture with id ${id} found`);
    }
    let lineageIds = rows.map(r => r.lineage_id);
    let lineages = await this.lineageRepo.getManyByIds(lineageIds);
    let nameIds = rows.map(r => r.name_id);
    let nameOptions = await this.nameRepo.getManyByIds(nameIds);
    return CultureMapper.toCulture(rows, lineages, nameOptions);
  }

  async getAll(): Promise<Culture[]> {
    let query = `${this.baseQuery} WHERE 1 GROUP BY c.id;`
    let rows: CultureRow[] = await this.pool.execute(query)[0];
    if (rows.length == 0) {
      return [];
    }
    let groups = groupRowsById(rows);
    let lineages = await this.lineageRepo.getAll();
    let names = await this.nameRepo.getAll();
    let output: Culture[] = [];
    for (let [_, values] of groups) {
      output.push(CultureMapper.toCulture(values, lineages, names))
    }
    return output;
  }

  async deleteById(id: number): Promise<void> {
    let query = `DELETE FROM culture WHERE id = ?;`;
    await this.pool.query(query, [id]);
  }

  async upsert(culture: Culture): Promise<Culture> {
    if (culture.id == -1) {
      await this.deleteById(culture.id);
    }
    await this.pool.beginTransaction()
    let query = `INSERT INTO culture (id, name, name_template) VALUES (?, ?, ?);`
    let result: ResultSetHeader = await this.pool.query<ResultSetHeader>(query, [culture.id == -1 ? null : culture.id, culture.name, culture.nameTemplate])[0]
    if (culture.id != -1 && result.insertId != culture.id) {
      this.logger.error(`Insert id ${result.insertId} did not match original id ${culture.id}`,`CultureRepository.upsert`, `CultureRepository`);
      await this.pool.rollback();
    }
    let nameInsertQuery = `INSERT INTO culture_name_frequency (culture_id, name_id, frequency) VALUES (?, ?, ?)`
    for (let nameFrequency of culture.personNames) {
      await this.pool.query(nameInsertQuery, [result.insertId, nameFrequency.value.id, nameFrequency.frequency]);
    }
    let lineageQuery = `INSERT INTO culture_lineage_frequency (culture_id, lineage_id, frequency) VALUES(?, ?, ?)`
    for (let LineageFrequency of culture.demographics) {
      await this.pool.query(lineageQuery, [result.insertId, LineageFrequency.value.id, LineageFrequency.frequency]);
    }
    await this.pool.commit();
    if (culture.id == -1) {
      culture.id = result.insertId;
    }
    return culture;
  }

  async addName(name: NameFrequency, cultureId: number): Promise<Culture> {
    let nameInsertQuery = `INSERT INTO culture_name_frequency (culture_id, name_id, frequency) VALUES (?, ?, ?)`
    await this.pool.query(nameInsertQuery, [cultureId, name.value.id, name.frequency]);
    return await this.getById(cultureId);
  }

  async exists(id: number): Promise<boolean> {
    let result: {count: number} = await this.pool.query(`SELECT COUNT(id) as count FROM culture WHERE id = ?`, [id])[0];
    return result.count == 1;
  }
}

class CultureMapper {
  static toCulture(rows: CultureRow[], lineages: Lineage[], names: NameOption[]): Culture {
    let first = rows[0];
    let lineageFrequencies: LineageFrequency[] = []
    let settlementNameFrequencies: NameFrequency[] = []
    let peopleNameFrequencies: NameFrequency[] = []
    for (let row of rows) {
      let lineage = lineages.find(x => x.id == row.lineage_id);
      let name = names.find(x => x.id == row.name_id);
      if (!lineage || !name) {
        continue
      }
      lineageFrequencies.push(new LineageFrequency(lineage!, row.lineage_frequency));
      let nameFreq = new NameFrequency(name, row.name_frequency);
      if (name.isType(NameType.SETTLEMENT)) {
        settlementNameFrequencies.push(nameFreq)
      } else {
        peopleNameFrequencies.push(nameFreq);
      }
    }
    return new Culture(first.name, first.name_template, {
      settlement: settlementNameFrequencies, person: peopleNameFrequencies
    }, lineageFrequencies);
  }
}

interface CultureRow extends IdentifiableRow {
  id: number
  name: string
  name_template: string
  lineage_id: number
  lineage_frequency: number
  name_id: number
  name_frequency: number
}