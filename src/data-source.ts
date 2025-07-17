import { DataSource } from "typeorm";
import { DBConfig } from "./infrastructure/config";
import { CulturePersonNamePrevalence, PersonNameEntry } from "./dataTypes/PersonNameEntry";
import { CultureEntry } from "./dataTypes/CultureEntry";
import { CultureDemographics, LineageEntry } from "./dataTypes/LineageEntry";
import { SettlementNameEntry } from "./dataTypes/SettlementNameEntry";

export function createDataSource(config: DBConfig): DataSource {
    return new DataSource({
        type: "mysql",
        host: config.host,
        port: 3306,
        username: config.username,
        password: config.password,
        database: "settlement_randomizer",
        entities: [
            PersonNameEntry,
            CultureEntry,
            CultureDemographics,
            CulturePersonNamePrevalence,
            LineageEntry,
            SettlementNameEntry
        ]
    })
}