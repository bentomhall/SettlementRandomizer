import fastify from "fastify";
import { attachGenericRoutes, attachPersonRoutes } from "./routes";
import { CultureController } from "./controllers/CultureController";
import { DataSource } from "typeorm";
import { AppConfig, readConfig } from "./infrastructure/config";
import { createDataSource } from "./data-source";
import { CultureFactory, CultureSourceFactory } from "./domain/CultureService";
const server = fastify();
let dataSource: DataSource;
let config: AppConfig;
let personController: CultureController;
let cultureFactory: CultureFactory;
(async () => {    
    try {
        config = await readConfig('default.json')
        dataSource = createDataSource(config.db);
        await dataSource.initialize();
        cultureFactory = new CultureSourceFactory(dataSource, config.quirks, config.occupations, true)
        personController = new CultureController(cultureFactory);
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