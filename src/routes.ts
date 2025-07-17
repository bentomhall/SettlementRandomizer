import fastify, { FastifyInstance, FastifyReply } from "fastify";
import { PersonController } from "./controllers/PersonController";

interface CustomHeaders {

}

interface IReply<T> {
  200: { success: boolean, result: T | null }
  204: { success: boolean }
  302: { url: string }
  '4xx': {error: string}
}

export function attachGenericRoutes(server: FastifyInstance) {
  server.get<{Reply: IReply<boolean>}>("/healthcheck", async (request, reply) => {
    respond<boolean>(reply, 200, true, true);
  });
}

export function attachPersonRoutes(server: FastifyInstance, controller: PersonController) {

}

function respond<T>(reply: FastifyReply<{Reply: IReply<T>}>, code: 200 | 204 | 400, success: boolean, value: T | null, error?: Error) {
  switch(code) {
    case 200:
      reply.code(code).send({success: success, result: value})
    case 204:
      reply.code(code).send({success: success})
    case 400:
      reply.code(code).send({error: `${error?.name ?? 'Unknown Error'}: ${error?.message ?? "Unknown Cause"}`})
  }
  return;
}
