import { HttpStatusCode } from "../shared/httpStatusCodes";
import { ErrorResult } from "./errors";

export class BadRequestError extends ErrorResult {
  statusCode = HttpStatusCode.BadRequest;

  constructor(public reason: string) {
    super(reason);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError() {
    return [{ message: this.reason }];
  }
}