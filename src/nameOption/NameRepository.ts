import { Injectable, NotFoundException } from "@nestjs/common";
import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DatabaseProvider, groupRowsById, IdentifiableRow } from "src/shared/dbProvider";
import { NameOption } from "./NameOption";
import { Name } from "src/shared/Name";
import { NameType } from "./NameType";
import { Logger } from "@nestjs/common";

@Injectable()
export class NameRepository {
    private baseQuery = `SELECT
        n.id, n.value, t.value as type
        FROM name_option n
        JOIN name_type t
            ON t.id = n.type_id
        `;
    
    private pool: Pool;
    private logger = new Logger(NameRepository.name)

    constructor(db: DatabaseProvider) {
        this.pool = db.pool;
    }

    async getOneById(id: number): Promise<NameOption> {
        let query = `${this.baseQuery} WHERE n.id=?`;
        let rows: NameRow[] = await this.pool.execute<RowDataPacket[]>(query, [id])[0]
        if (rows.length == 0) {
            throw new NotFoundException(`No name options found with id ${id}`)
        }
        let row = rows[0];
        return NameMapper.toNameOption(row)
    }

    async getOneByValue(value: Name): Promise<NameOption | null> {
        let query = `${this.baseQuery} where n.value = ?`;
        let rows: NameRow[] = await this.pool.execute<RowDataPacket[]>(query, [value.value])[0]
        if (rows.length == 0) {
            return null;
        }
        let row = rows[0];
        return NameMapper.toNameOption(row);
    }

    async getManyByIds(ids: number[]): Promise<NameOption[]> {
        let query = `${this.baseQuery} WHERE n.id in (?);`;
        let rows: NameRow[] = await this.pool.execute(query, [ids])[0]
        if (rows.length == 0) {
            return []
        }
        return rows.map(x => NameMapper.toNameOption(x));
    }

    async getByType(type: NameType): Promise<NameOption[]> {
        let query = `${this.baseQuery} WHERE t.id = ?`;
        let rows: NameRow[] = await this.pool.execute<RowDataPacket[]>(query, [type.id])[0];
        return rows.map(r => NameMapper.toNameOption(r))
    }

    async getAll(): Promise<NameOption[]> {
        let rows: NameRow[] = await this.pool.execute<RowDataPacket[]>(`${this.baseQuery} WHERE 1;`)[0];
        return rows.map(r => NameMapper.toNameOption(r))
    }

    async insertOne(name: NameOption): Promise<NameOption> {
        let query = `INSERT INTO name_option (value, type_id) VALUES (?, ?)`;
        let result = await this.pool.query<ResultSetHeader>(query, [name.value, name.type.id])
        let id = result[0].insertId;
        name.id = id;
        return name;
    }

    async getPersonNames(): Promise<Map<string, NameOption[]>> {
        let query = `${this.baseQuery} WHERE t.id > 1 GROUP BY type;`
        let rows: NameRow[] = await this.pool.execute<RowDataPacket[]>(query)[0];
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
        let rows: NameRow[] = await this.pool.execute<RowDataPacket[]>(query)[0];
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
}

class NameMapper {
    static toNameOption(n: NameRow) {
        let name = new Name(n.value);
        let type = NameType.parse(n.type) ?? NameType.given
        return new NameOption(name, type, n.id);
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