import { HttpException } from "../exceptions/root";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction ) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong",
    errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
    errors: err.errors || null,
  });
}