import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CultureController } from "./controllers/CultureController";
import { HttpError, HttpResponseCode, NotFoundError } from "./dataTypes/Errors";
import { Person } from "./dataTypes/DTOs/Person";
import { ApiResult, err, getError, getValue, ok } from "./dataTypes/Result";

interface CustomHeaders {

}

interface IReply<T> {
  200: { result: T }
  204: { }
  302: { url: string }
  '4xx': {error: string}
  '5xx': {error: string}
}

export function attachGenericRoutes(server: FastifyInstance) {
  server.get<{Reply: IReply<boolean>}>("/healthcheck", async (request, reply) => {
    respond<boolean>(reply, ok(true));
  });
}

export function attachPersonRoutes(server: FastifyInstance, controller: CultureController) {
  server.addSchema({
    $id: "createPersonInput",
    type: 'object',
    properties: {
      cultureKey: { type: 'string' }
    }
  })
  server.get<{Params: {cultureKey: string}, Reply: IReply<Person>}>('/culture/:cultureKey/person',
  {
    schema: {
      params: { $ref: 'createPersonInput#'}
    },
  }, async (request: FastifyRequest<{Params: {cultureKey: string}}>, reply) => {
    let cultureKey = request.params.cultureKey
    let personResult = await controller.generatePerson(cultureKey)
    respond<Person>(reply, personResult)
  })
}

function respond<T>(reply: FastifyReply<{Reply: IReply<T>}>, value: ApiResult<T>) {
  let error = getError(value)  
  if (error) {
    let code = error.code;
    reply.code(code).send({error: `${error.name} ${error.message}`})
  } else {
    let v = getValue(value)
    if (!v) {
      respond<T>(reply, err(new HttpError('Unexpected nil value while unwrapping result')))
      return
    }
    reply.code(HttpResponseCode.OK).send({result: v})
  }
  return;
}
