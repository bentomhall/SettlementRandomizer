import { DataSource } from "typeorm";
import { DBConfig } from "./infrastructure/config";
import { PersonNameEntry } from "./dataTypes/PersonNameEntry";
import { CultureEntry } from "./dataTypes/CultureEntry";
import { LineageEntry } from "./dataTypes/LineageEntry";
import { CultureDemographics } from "./dataTypes/CultureDemographics";
import { SettlementNameEntry } from "./dataTypes/SettlementNameEntry";
import { CulturePersonNamePrevalence } from "./dataTypes/CulturePersonNamePrevalence";

export function createDataSource(config: DBConfig): DataSource {
    return new DataSource({
        type: "mysql",
        host: config.host,
        port: 3306,
        username: config.username,
        password: config.password,
        database: "settlement_randomizer",
        synchronize: true, //not really a production thing yet...
        entities: [
            LineageEntry,
            CultureDemographics,
            CulturePersonNamePrevalence,
            PersonNameEntry,
            SettlementNameEntry,
            CultureEntry,
        ]
    })
}