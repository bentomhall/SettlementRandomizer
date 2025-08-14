import { Injectable, NotFoundException } from "@nestjs/common";
import { Pool, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseProvider, executeQuery, IdentifiableRow, insert } from "src/shared/dbProvider";
import { NameOption } from "./NameOption";
import { Name } from "src/shared/Name";
import { NameType } from "./NameType";
import { Logger } from "@nestjs/common";
import { InvalidOperationError } from "src/shared/CustomErrors";

@Injectable()
export class NameRepository {
    private baseQuery = `SELECT
        n.id, n.value, t.value as type,
        g.tag as gender_key
        FROM name_option n
        JOIN name_type t
            ON t.id = n.type_id
        JOIN gender g
            on g.id = n.gender_id
        `;
    
    private pool: Pool;
    private logger = new Logger(NameRepository.name)

    constructor(db: DatabaseProvider) {
        this.pool = db.pool;
    }

    async getOneById(id: number): Promise<NameOption> {
        let query = `${this.baseQuery} WHERE n.id=?`;
        let rows: NameRow[] = await executeQuery(this.pool, query, [id], this.logger);
        if (rows.length == 0) {
            throw new NotFoundException(`No name options found with id ${id}`)
        }
        let row = rows[0];
        return NameMapper.toNameOption(row)
    }

    async getOneByValue(value: Name): Promise<NameOption | null> {
        let query = `${this.baseQuery} where n.value = ?`;
        let rows: NameRow[] = await executeQuery(this.pool, query, [value.value], this.logger);
        if (rows.length == 0) {
            return null;
        }
        let row = rows[0];
        return NameMapper.toNameOption(row);
    }

    async getManyByIds(ids: number[]): Promise<NameOption[]> {
        let query = `${this.baseQuery} WHERE n.id in (?);`;
        let rows: NameRow[] = await executeQuery(this.pool, query, [ids], this.logger);
        if (!rows || rows.length == 0) {
            return []
        }
        return rows.map(x => NameMapper.toNameOption(x));
    }

    async getByType(type: NameType): Promise<NameOption[]> {
        let query = `${this.baseQuery} WHERE t.id = ?`;
        let rows: NameRow[] = await executeQuery(this.pool, query, [type.id], this.logger);
        return rows.map(r => NameMapper.toNameOption(r))
    }

    async getAll(): Promise<NameOption[]> {
        let rows: NameRow[] = await executeQuery(this.pool, `${this.baseQuery} WHERE 1;`, [], this.logger);
        return rows.map(r => NameMapper.toNameOption(r))
    }

    async insertOne(name: NameOption): Promise<NameOption> {
        let query = `INSERT INTO name_option (value, type_id, gender_id) VALUES (?, ?, ?)`;
        let id = await insert(this.pool, query, [name.value, name.type.id, name.gender?.id], this.logger);
        if (id == null) {
            throw new InvalidOperationError(`Insert failed`);
        }
        name.id = id;
        return name;
    }

    async getPersonNames(): Promise<Map<string, NameOption[]>> {
        let query = `${this.baseQuery} WHERE t.id > 1 ORDER BY type;`
        let rows: NameRow[] = await executeQuery(this.pool, query, [], this.logger);
        let output = new Map<string, NameOption[]>(
            [
                [NameType.FAMILY, []],
                [NameType.GIVEN, []],
                [NameType.PARTICLE, []]
            ]
        );
        NameMapper.collateNameOptions(rows, output);
        return output;
    }

    async getSettlementNames(): Promise<NameOption[]> {
        let query = `${this.baseQuery} WHERE t.id = 1`;
        let rows: NameRow[] = await executeQuery(this.pool, query, [], this.logger);
        return rows.map(n => NameMapper.toNameOption(n));
    }

    async bulkInsert(names: NameOption[]): Promise<NameOption[]> {
        let output: NameOption[] = [];
        for (let name of names) {
            try {
                output.push(await this.insertOne(name))
            } catch (error) {
                // don't fail the whole batch.
                this.logger.warn({name, err: error}, `bulkInsert failed`)
            }
        }
        return output;
    }

    async deleteById(id: number): Promise<void> {
        await this.pool.query(`DELETE FROM name_option WHERE id=?`, [id]);
    }
}

interface NameRow extends IdentifiableRow {
    id: number;
    value: string;
    type: string;
    gender_id: number;
    gender_key: string
}

class NameMapper {
    static toNameOption(n: NameRow) {
        return NameOption.fromValues(n.value, n.type, n.gender_key, n.id);
    }

    static collateNameOptions(rows: NameRow[], intoMap: Map<string, NameOption[]>) {
        for (let row of rows) {
            let option = NameMapper.toNameOption(row);
            let options = intoMap.get(option.type.value);
            if (!options) {
                continue
            }
            options.push(option)
            intoMap.set(option.type.value, options)
        }
    }
}