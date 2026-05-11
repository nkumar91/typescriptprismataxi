import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter for login/signup
export const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    skipSuccessfulRequests: false,
    handler: (req:Request, res:Response) => {
        return res.status(429).json({
            success: "failed",
            statusCode: 429,
            message: 'Too many login/signup attempts, please try again later.',
        });


    },
});