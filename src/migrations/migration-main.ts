import { createPool } from "mysql2/promise";
import { MigrationRunner } from "./Migration";

let user='root'
let rootPassword=process.env.MYSQL_ROOT_PASSWORD
let database = 'settlement_randomizer'
let host = '127.0.0.1'
if (!rootPassword) {
    console.log('Must set `MYSQL_ROOT_PASSWORD` as an environment variable!');
    process.exit(1);
}

let pool = createPool({
    host,
    database,
    user,
    password: rootPassword
});
let migrationRunner = new MigrationRunner(pool);

(async () => {
    await migrationRunner.synchronizeSchema();
    process.exit(0);
})()

