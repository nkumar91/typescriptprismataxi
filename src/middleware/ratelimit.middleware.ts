import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
// Stricter rate limiter for login/signup
export const createLimiter = (windowsMs: number, max: number) => {
   const authLimiter = rateLimit({
    windowMs: windowsMs*60 * 1000, // 1 minute
    max: max, // limit each IP to 10 requests per windowMs
    skipSuccessfulRequests: false,
    handler: (req:Request, res:Response) => {
        return res.status(429).json({
            success: "failed",
            statusCode: 429,
            message: 'Too many login/signup attempts, please try again later.',
        });


    },
});
return authLimiter;
}
