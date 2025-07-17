import fastify from "fastify";
import { attachGenericRoutes, attachPersonRoutes } from "./routes";
import { PersonController } from "./controllers/PersonController";

const server = fastify();
const personController = new PersonController();
attachGenericRoutes(server);
attachPersonRoutes(server, personController);

server.listen({port: 8080})