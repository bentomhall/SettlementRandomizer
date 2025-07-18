export enum HttpResponseCode {
  OK = 200,
  NO_DATA = 204,
  REDIRECT = 302,
  REQUEST_ERROR = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

export class HttpError extends Error {
    public code: HttpResponseCode = HttpResponseCode.SERVER_ERROR
    constructor(message?: string, error?: Error, ) {
        super(error?.message ?? message)
    }
}

export class NotFoundError extends HttpError {
    public code: HttpResponseCode = HttpResponseCode.NOT_FOUND
}