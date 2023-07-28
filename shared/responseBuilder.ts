import { ApiResponse, Response } from '../interfaces/common';
import { HttpStatusCode } from './httpStatusCodes';

export class ResponseBuilder {
    public static ok<T>(result: T, res: Response): void {
        ResponseBuilder._returnAs(result, HttpStatusCode.Ok, res);
    }

    private static _returnAs<T>(result: T, statusCode: number, res: Response): void {
        const bodyObject: ApiResponse<T> = { status: statusCode, data: result };

        res.status(statusCode).send(bodyObject);
    }
}