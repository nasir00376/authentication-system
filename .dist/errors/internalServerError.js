"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const httpStatusCodes_1 = require("../shared/httpStatusCodes");
const errors_1 = require("./errors");
class InternalServerError extends errors_1.ErrorResult {
    constructor(reason) {
        super(reason);
        this.reason = reason;
        this.statusCode = httpStatusCodes_1.HttpStatusCode.InternalServerError;
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
    serializeError() {
        return [{ message: this.reason }];
    }
}
exports.InternalServerError = InternalServerError;
