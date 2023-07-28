import "express-async-errors";

import Debug, { Debugger } from "debug";
import express from "express";
import dotenv from 'dotenv';


import { connectDB } from './config/db'
import { errorHandler } from "./middlewares/errorHandlers";
import { NotFoundError } from "./errors";

import { userRouter } from "./router";


dotenv.config();

const debug: Debugger = Debug("EmailGuesser:app");

const PORT = parseInt(<string>process.env.PORT) || 4000;
const app: express.Application = express();


if (!process.env.JWT_PRIVATE_KEY) {
    console.error('FATAL ERROR: JWT_PRIVATE_KEY is not defined.');
    debug('FATAL ERROR: JWT_PRIVATE_KEY is not defined.');

    process.exit(1);
}
connectDB();

// Middleware
app.use(express.json());
app.use('/api/auth', userRouter);

// app.all("*", async () => {
//     throw new NotFoundError("Route not found.");
// });

app.use(errorHandler);

app.listen(PORT, () => debug(`Server is listening on port: ${PORT}`));

export { app };