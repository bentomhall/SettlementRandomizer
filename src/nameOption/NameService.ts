import { Injectable, Logger } from "@nestjs/common";
import { NameRepository } from "./NameRepository";
import { NameType } from "./NameType";
import { NameOption } from "./NameOption";
import { Name } from "src/shared/Name";
import { InvalidParameterError } from "src/shared/CustomErrors";

export const nameTypeOptions = {
    FAMILY: NameType.FAMILY,
    GIVEN: NameType.GIVEN,
    PARTICLE: NameType.PARTICLE,
    SETTLEMENT: NameType.SETTLEMENT,
    PERSON: 'person',
    ALL: 'all'
}

export type NameOptions = keyof typeof nameTypeOptions

@Injectable()
export class NameService {
    constructor(private repo: NameRepository){}
    private logger = new Logger('NameService');
    async getAllByType(type: NameOptions): Promise<NameOption[]> {
        let values: NameOption[] | Map<string, NameOption[]>;
        switch (type.toUpperCase()) {
            case "FAMILY":
                values = await this.repo.getByType(NameType.family);
                break;
            case "GIVEN":
                values = await this.repo.getByType(NameType.given);
                break;
            case "PARTICLE":
                values = await this.repo.getByType(NameType.particle);
                break;
            case "SETTLEMENT":
                values = await this.repo.getSettlementNames();
                break;
            case "PERSON":
                values = await this.repo.getPersonNames();
                break;
            case 'ALL':
                values = await this.repo.getAll();
                break;
            default:
                throw new InvalidParameterError(`Type ${type.toUpperCase()} not allowed.`)
        }
        if (!values) {
            return []
        }
        if (Array.isArray(values)) {
            return values;
        }
        return Array.from(values.values()).flat();
    }

    async getOneById(id: number): Promise<NameOption> {
        return await this.repo.getOneById(id);
    }

    async insertOne(name: NameOption): Promise<NameOption> {
        return await this.repo.insertOne(name);
    }

    async bulkInsert(names: NameOption[]): Promise<NameOption[]> {
        let returned = await this.repo.bulkInsert(names);
        if (returned.length == names.length) {
            return returned;
        }
        for (let name of names) {
            if (returned.find(n => n.value == name.value) == null) {
                let duplicate = await this.repo.getOneByValue(new Name(name.value))
                if (duplicate) {
                    returned.push(duplicate);
                }
            }
        }
        return returned;
    }

    async deleteById(id: number): Promise<void> {
        return await this.repo.deleteById(id);
    }
}