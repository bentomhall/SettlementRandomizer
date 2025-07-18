import { HttpError } from "./Errors";

/**
 * FROM https://www.dennisokeeffe.com/blog/2024-07-14-creating-a-result-type-in-typescript#updated-approach-dec-5-th-2024
 */
class Ok<T> {
  readonly _tag = "ok";
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

class Err<E> {
  readonly _tag = "err";
  error: E;

  constructor(error: E) {
    this.error = error;
  }
}

type Result<T, E> = Ok<T> | Err<E>;
export type ApiResult<T> = Result<T, HttpError>;

export function err<E>(e: E): Err<E> {
  return new Err(e);
}

export function ok<T>(t: T): Ok<T> {
  return new Ok(t);
}

export function getError<T, E>(r: Result<T, E>): E | null {
  if (r instanceof Err) {
    return r.error
  }
  return null
}

export function getValue<T, E>(r: Result<T, E>): T | null {
  if (r instanceof Err) {
    return null;
  }
  return (r as Ok<T>).value
}