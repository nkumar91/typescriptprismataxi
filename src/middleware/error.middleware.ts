import { Request, Response, NextFunction } from "express";
export const errorHandler = (
    error: any,
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