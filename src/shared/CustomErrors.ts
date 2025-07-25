import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidParameterError extends HttpException {
  constructor(message: string) {
    super(`Invalid Parameter: ${message}`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidOperationError extends HttpException {
  constructor(message: string) {
    super(`Invalid operation: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class NotFoundError extends HttpException {
  constructor(object: string) {
    super(`${object} not found`, HttpStatus.NOT_FOUND);
  }
}