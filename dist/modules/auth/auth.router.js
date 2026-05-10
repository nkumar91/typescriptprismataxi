import express from "express";
const authRouter = express.Router();
import * as authController from "./auth.controller.js";
authRouter.post("/register", authController.register);
export default authRouter;
