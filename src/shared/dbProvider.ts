import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFile } from "fs/promises";
import { createPool, Pool, ResultSetHeader } from "mysql2/promise"
import * as path from "path";

@Injectable()
export class DatabaseProvider {
  #pool: Pool
  private logger: Logger = new Logger(DatabaseProvider.name);

  constructor(config: ConfigService) {
    let database = config.getOrThrow('DB_NAME');
    let username = config.getOrThrow('DB_USERNAME');
    let password = config.getOrThrow('DB_PASSWORD');
    let host = config.getOrThrow('DB_HOST');
    this.#pool = createPool({
      host,
      database,
      user: username,
      password,
    })
  }

  public get pool(): Pool {
    return this.#pool
  }
}

export enum DataFileType {
  QUIRKS,
  OCCUPATIONS
}

@Injectable()
export class DataFileProvider {
  private dataDirectory: string
  private locations: Map<DataFileType, string> = new Map(
    [
      [DataFileType.QUIRKS, 'quirks.json'],
      [DataFileType.OCCUPATIONS, 'occupations.json']
    ]
  );

  private dataCache: Map<DataFileType, string[]> = new Map();

  constructor(config: ConfigService) {
    this.dataDirectory = path.join(__dirname, config.getOrThrow('DATA_DIRECTORY'))
  }

  public async getData(type: DataFileType): Promise<string[]> {
    if (this.dataCache.has(type)) {
      return this.dataCache.get(type)!
    }
    let data = await readFile(path.join(this.dataDirectory, this.locations.get(type)!))
    let json = await JSON.parse(data.toString())
    this.dataCache.set(type, json);
    return json;
  }
}

export interface IdentifiableRow {
  id: number
}

export function groupRowsById<T extends IdentifiableRow>(rows: T[]): Map<number, T[]> {
  let output = new Map<number, T[]>()
  for (let row of rows) {
    let group = output.get(row.id) ?? [];
    group.push(row)
    output.set(row.id, group)
  }
  return output;
}

export async function executeQuery<T>(pool: Pool, query: string, params: any[], logger: Logger): Promise<T[]> {
  try {
      let result: T[] | undefined = await pool.execute(query, params)[0];
    if (!result) {
      return []
    }
    return result
  } catch (error) {
    logger.error((error as Error).message, (error as Error).stack)
    return []
  }
}

export async function insert(pool: Pool, query: string, values: any[], logger: Logger): Promise<number | null> {
  try {
    let result: ResultSetHeader = await pool.query<ResultSetHeader>(query, values)[0];
    if (!result || result.insertId <= 0) {
      logger.error(`Insert failed ${result?.warningStatus ?? 'result was undefined'}`);
      return null
    }
    return result.insertId;
  } catch (error) {
    let err = error as Error;
    logger.error(err.message, err.stack)
    return null;
  }
}