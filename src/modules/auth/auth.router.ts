import express from "express";
const authRouter = express.Router();
import * as authController from "./auth.controller.js";
import { loginValidation, signupValidation } from "./auth.validator.js";
authRouter.post("/register", signupValidation, authController.register);
authRouter.post("/login", loginValidation, authController.login);

export default authRouter;