"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResult = void 0;
class ErrorResult extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ErrorResult = ErrorResult;
