import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./root";
import { InternalException } from "./internal-exception";

export const errorHandler = (method: Function) => { 
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (error) {
            console.log("Caught error:", error); 
            let exception: HttpException;

            if (error instanceof HttpException) {
                exception = error;
            } else {
                console.log("Error was not an instance of HttpException");
                exception = new InternalException("Something went wrong!", error, ErrorCode.INTERNAL_EXCEPTION);
            }
            next(exception);
        }
    };
}
