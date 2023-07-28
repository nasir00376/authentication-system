import Debug, { Debugger } from 'debug';
import mongoose from 'mongoose';

const debug: Debugger = Debug("auth:config");


export const connectDB = async () => {
    const { DB_NAME, DB_PASSWORD, DB_CLUSTER, DB_USERNAME } = process.env;

    try {
        await mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}`);
        debug(`MongoDB connected successfully`);
    } catch (error) {
        debug(`Could\'t connect to database: ${error}`);
    }

}