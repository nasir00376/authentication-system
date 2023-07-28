import { HttpStatusCode } from "../shared/httpStatusCodes";
import { ErrorResult } from "./errors";

export class InternalServerError extends ErrorResult {
  statusCode = HttpStatusCode.InternalServerError;

  constructor(public reason: string) {
    super(reason);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeError() {
    return [{ message: this.reason }];
  }
}