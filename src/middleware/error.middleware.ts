import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.js";
export const errorHandler = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: "failed",
        message: error.message || "Internal Server Error",
    });
};