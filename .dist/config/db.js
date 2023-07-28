"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const debug_1 = __importDefault(require("debug"));
const mongoose_1 = __importDefault(require("mongoose"));
const debug = (0, debug_1.default)("auth:config");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const { DB_NAME, DB_PASSWORD, DB_CLUSTER, DB_USERNAME } = process.env;
    try {
        yield mongoose_1.default.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}`);
        debug(`MongoDB connected successfully`);
    }
    catch (error) {
        debug(`Could\'t connect to database: ${error}`);
    }
});
exports.connectDB = connectDB;
