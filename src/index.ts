import fastify from "fastify";
import { attachGenericRoutes, attachPersonRoutes } from "./routes";
import { PersonController } from "./controllers/PersonController";
import { DataSource } from "typeorm";
import { AppConfig, readConfig } from "./infrastructure/config";
import { createDataSource } from "./data-source";
const server = fastify();
let dataSource: DataSource;
let config: AppConfig;
let personController: PersonController;

(async () => {    
    try {
        config = await readConfig('default.json')
        dataSource = createDataSource(config.db);
        await dataSource.initialize();
        personController = new PersonController(dataSource, config.quirks, config.occupations);
        attachGenericRoutes(server);
        attachPersonRoutes(server, personController);
    } catch (error) {
        console.error(`Error during initialization ${(error as Error).message}`)
        process.exit(1)
    }
    try {
        server.listen({port: config.api.port});
    } catch (error) {
        console.error(`Error from api: ${error}`);
    }
})()