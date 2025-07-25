import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFile } from "fs/promises";
import { createPool, Pool } from "mysql2/promise"
import path from "path";

@Injectable()
export class DatabaseProvider {
  #pool: Pool

  constructor(@Inject() config: ConfigService) {
    let database = config.getOrThrow('DB_NAME');
    let username = config.getOrThrow('DB_USERNAME');
    let password = config.getOrThrow('DB_PASSWORD');
    let host = config.getOrThrow('DB_HOST');
    this.#pool = createPool({
      host,
      database,
      user: username,
      password
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

  constructor(@Inject() config: ConfigService) {
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