"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("express-async-errors");
const debug_1 = __importDefault(require("debug"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const errorHandlers_1 = require("./middlewares/errorHandlers");
const router_1 = require("./router");
dotenv_1.default.config();
const debug = (0, debug_1.default)("EmailGuesser:app");
const PORT = parseInt(process.env.PORT) || 4000;
const app = (0, express_1.default)();
exports.app = app;
if (!process.env.JWT_PRIVATE_KEY) {
    console.error('FATAL ERROR: JWT_PRIVATE_KEY is not defined.');
    debug('FATAL ERROR: JWT_PRIVATE_KEY is not defined.');
    process.exit(1);
}
(0, db_1.connectDB)();
// Middleware
app.use(express_1.default.json());
app.use('/api/auth', router_1.userRouter);
// app.all("*", async () => {
//     throw new NotFoundError("Route not found.");
// });
app.use(errorHandlers_1.errorHandler);
app.listen(PORT, () => debug(`Server is listening on port: ${PORT}`));
