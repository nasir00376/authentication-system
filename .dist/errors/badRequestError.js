"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const httpStatusCodes_1 = require("../shared/httpStatusCodes");
const errors_1 = require("./errors");
class BadRequestError extends errors_1.ErrorResult {
    constructor(reason) {
        super(reason);
        this.reason = reason;
        this.statusCode = httpStatusCodes_1.HttpStatusCode.BadRequest;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeError() {
        return [{ message: this.reason }];
    }
}
exports.BadRequestError = BadRequestError;
