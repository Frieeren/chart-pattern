import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(400, message);
  }
}

export class InternetServerError extends BaseError {
  constructor(message: string) {
    super(500, message);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(404, message);
  }
}