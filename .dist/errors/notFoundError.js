"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const errors_1 = require("./errors");
class NotFoundError extends errors_1.ErrorResult {
    constructor(reason) {
        super('Resource not found.');
        this.reason = reason;
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeError() {
        return [{ message: this.reason }];
    }
}
exports.NotFoundError = NotFoundError;
