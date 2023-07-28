"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilder = void 0;
const httpStatusCodes_1 = require("./httpStatusCodes");
class ResponseBuilder {
    static ok(result, res) {
        ResponseBuilder._returnAs(result, httpStatusCodes_1.HttpStatusCode.Ok, res);
    }
    static _returnAs(result, statusCode, res) {
        const bodyObject = { status: statusCode, data: result };
        res.status(statusCode).send(bodyObject);
    }
}
exports.ResponseBuilder = ResponseBuilder;
