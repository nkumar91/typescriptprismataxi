import express from "express";
const authRouter = express.Router();
import * as authController from "./auth.controller.js";
import { loginValidation, signupValidation } from "./auth.validator.js";
import { createLimiter } from "../../middleware/ratelimit.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
authRouter.post(
    "/register", 
    createLimiter(1, 10), // Limit to 10 requests per 1 minute for registration
    signupValidation, 
    authController.register
);
authRouter.post(
    "/login", 
    createLimiter(1, 10), // Limit to 10 requests per 1 minute for login
    loginValidation, 
    authController.login
);
authRouter.post(
    "/logout", 
    createLimiter(1, 60), // Limit to 60 requests per 1 minute for logout
    requireAuth,
    authController.logout
);

authRouter.post(
    "/reset-password", 
    createLimiter(1, 5), // Limit to 5 requests per 1 minute for password reset
    requireAuth,
    authController.resetUserPassword
);

authRouter.post(
    "/verify-email", 
    createLimiter(1, 10), // Limit to 10 requests per 1 minute for email verification
    authController.verifyEmailController
);

export default authRouter;