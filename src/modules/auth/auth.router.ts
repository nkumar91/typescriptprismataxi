import express from "express";
const authRouter = express.Router();
import * as authController from "./auth.controller.js";
import { loginValidation, signupValidation } from "./auth.validator.js";
import { authLimiter } from "../../middleware/ratelimit.middleware.js";
authRouter.post(
    "/register", 
    authLimiter,
    signupValidation, 
    authController.register
);
authRouter.post(
    "/login", 
    authLimiter, 
    loginValidation, 
    authController.login
);
authRouter.post(
    "/logout", 
    authController.logout
);

export default authRouter;