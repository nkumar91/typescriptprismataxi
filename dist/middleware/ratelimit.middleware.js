import rateLimit from "express-rate-limit";
// Stricter rate limiter for login/signup
export const createLimiter = (windowsMs, max, message) => {
    const authLimiter = rateLimit({
        windowMs: windowsMs * 60 * 1000, // 1 minute
        max: max, // limit each IP to 10 requests per windowMs
        skipSuccessfulRequests: false,
        handler: (req, res) => {
            return res.status(429).json({
                success: "failed",
                statusCode: 429,
                message: message || 'Too many attempts, please try again later.',
            });
        },
    });
    return authLimiter;
};
