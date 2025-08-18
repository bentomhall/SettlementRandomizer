import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { FieldPacket, Pool, ResultSetHeader, PoolConnection } from "mysql2/promise";
import { LineageRepository } from "src/lineage/LineageRepository";
import { NameRepository } from "src/nameOption/NameRepository";
import { DatabaseProvider, executeQuery, groupRowsById, IdentifiableRow, insert } from "src/shared/dbProvider";
import { Culture, CultureDto, LineageFrequency, NameFrequency } from "./Culture";
import { NameOption } from "src/nameOption/NameOption";
import { Lineage } from "src/lineage/Lineage";
import { NameType } from "src/nameOption/NameType";
import { InvalidOperationError } from "src/shared/CustomErrors";

@Injectable()
export class CultureRepository {
  pool: Pool
  logger: Logger = new Logger(CultureRepository.name)
  constructor(db: DatabaseProvider, private nameRepo: NameRepository, private lineageRepo: LineageRepository) {
    this.pool = db.pool;
  }

  private baseQuery = `SELECT
      c.id, c.name, c.name_template
    FROM culture c

  `;

  private nameFrequencyQuery = `SELECT
      culture_id, name_id, frequency
    FROM culture_name_frequency
      WHERE culture_id = ?;
  `

  private lineageFrequencyQuery = `SELECT
      culture_id, lineage_id, frequency
    FROM culture_lineage_frequency
      WHERE culture_id = ?;
  `

  async getById(id: number): Promise<Culture> {
    let query = `${this.baseQuery} WHERE c.id = ?;`;
    let rows: CultureRow[] = await executeQuery(this.pool, query, [id], this.logger);
    if (rows.length == 0) {
      throw new NotFoundException(`No culture with id ${id} found`);
    }
    let lineageIds: CultureLineageFrequencyRow[] = await executeQuery(this.pool, this.lineageFrequencyQuery, [id], this.logger);
    let lineages = await this.lineageRepo.getManyByIds(lineageIds.map(x => x.lineage_id));
    let nameIds: CultureNameFrequencyRow[] = await executeQuery(this.pool, this.nameFrequencyQuery, [id], this.logger);
    let nameOptions = await this.nameRepo.getManyByIds(nameIds.map(x => x.name_id));
    return CultureMapper.toCulture(rows[0], lineageIds, nameIds, lineages, nameOptions);
  }

  async getAll(): Promise<Culture[]> {
    let query = `${this.baseQuery} WHERE 1 GROUP BY c.id, lf.lineage_id, nf.name_id;`
    let rows: CultureRow[] = await executeQuery(this.pool, query, [], this.logger);
    if (rows.length == 0) {
      this.logger.debug(`No cultures to get, returning early`);
      return [];
    }
    let lineages = await this.lineageRepo.getAll();
    let names = await this.nameRepo.getAll();
    let output: Culture[] = [];
    for (let row of rows) {
      let lineageRows: CultureLineageFrequencyRow[] = await executeQuery(this.pool, this.lineageFrequencyQuery, [row.id], this.logger);
      let nameRows: CultureNameFrequencyRow[] = await executeQuery(this.pool, this.nameFrequencyQuery, [row.id], this.logger); 
      output.push(CultureMapper.toCulture(row, lineageRows, nameRows, lineages, names))
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
    let conn: PoolConnection = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      let query = `INSERT INTO culture (id, name, name_template) VALUES (?, ?, ?);`
      let id = await insert(conn, query, [culture.id == -1 ? null : culture.id, culture.name, culture.nameTemplate], this.logger)
      if (!id) {
        throw new InvalidOperationError('Insert failed');
      }
      if (culture.id != -1 && id != culture.id) {
        throw new InvalidOperationError(`Insert id ${id} did not match original id ${culture.id}`)
      }
      let nameInsertQuery = `INSERT INTO culture_name_frequency (culture_id, name_id, frequency) VALUES (?, ?, ?)`
      for (let nameFrequency of culture.personNames) {
        await conn.query(nameInsertQuery, [id, nameFrequency.value.id, nameFrequency.frequency]);
      }
      for (let nameFrequency of culture.settlementNames) {
        await conn.query(nameInsertQuery, [id, nameFrequency.value.id, nameFrequency.frequency]);
      }
      let lineageQuery = `INSERT INTO culture_lineage_frequency (culture_id, lineage_id, frequency) VALUES (?, ?, ?)`
      for (let LineageFrequency of culture.demographics) {
        await conn.query(lineageQuery, [id, LineageFrequency.value.id, LineageFrequency.frequency]);
      }
      await conn.commit();
      if (culture.id == -1) {
        culture.id = id;
      }
      return culture;
    } catch (error) {
      let err = error as Error;
      this.logger.error(`Insert failed: ${err.message}`, err.stack);
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async addName(name: NameFrequency, cultureId: number): Promise<Culture> {
    let nameInsertQuery = `INSERT INTO culture_name_frequency (culture_id, name_id, frequency) VALUES (?, ?, ?)`
    await insert(this.pool, nameInsertQuery, [cultureId, name.value.id, name.frequency], this.logger);
    return await this.getById(cultureId);
  }

  async exists(id: number): Promise<boolean> {
    let result: {count: number}[] = await executeQuery(this.pool, `SELECT COUNT(id) as count FROM culture WHERE id = ?`, [id], this.logger);
    return result.length > 0 && result[0].count == 1;
  }
}

class CultureMapper {
  static toCulture(row: CultureRow, lineageRows: CultureLineageFrequencyRow[], nameRows: CultureNameFrequencyRow[], lineages: Lineage[], names: NameOption[]): Culture {
    let lineageFrequencies: LineageFrequency[] = []
    for (let row of lineageRows) {
      let l = lineages.find(x => x.id == row.lineage_id);
      if (!l) {
        throw new InvalidOperationError(`Did not find required lineage with id ${row.lineage_id}!`);
      }
      lineageFrequencies.push(new LineageFrequency(l, row.frequency));
    }
    let settlementNameFrequencies: NameFrequency[] = []
    let peopleNameFrequencies: NameFrequency[] = []
    for (let row of nameRows) {
      let n = names.find(x => x.id == row.name_id);
      if (!n) {
        throw new InvalidOperationError(`Did not find required name with id ${row.name_id}`);
      }
      if (n.isType(NameType.SETTLEMENT)) {
        settlementNameFrequencies.push(new NameFrequency(n, row.frequency));
      } else {
        peopleNameFrequencies.push(new NameFrequency(n, row.frequency));
      }
    }
    
    return new Culture(row.name, row.name_template, {
      settlement: settlementNameFrequencies, person: peopleNameFrequencies
    }, lineageFrequencies, row.id);
  }
}

interface CultureRow extends IdentifiableRow {
  id: number
  name: string
  name_template: string
}

interface CultureLineageFrequencyRow {
  culture_id: number
  lineage_id: number
  frequency: number
}

interface CultureNameFrequencyRow {
  culture_id: number
  name_id: number
  frequency: number
}