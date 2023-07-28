import { ErrorResult } from "../errors";
import { Response, Request, Application } from 'express';

export { Request, Response, Application }

export type ApiHandler = (req: Request, res: Response) => Promise<void>;

export interface ErrorResponseBody {
    error: ErrorResult;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}
