"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../errors");
function errorHandler(error, req, res, next) {
    if (error instanceof errors_1.ErrorResult) {
        return res.status(error.statusCode).send({ errors: error.serializeError() });
    }
    return res.status(400).send({ errors: [{ message: error.message || 'Something went wrong.' }] });
}
exports.errorHandler = errorHandler;
