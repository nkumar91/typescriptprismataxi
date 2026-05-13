import express from "express";
import authRouter from "../modules/auth/auth.router.js";
import userRouter from "../modules/user/user.router.js";
const allRoutes = express.Router();
allRoutes.use("/auth", authRouter);
allRoutes.use("/user", userRouter);
export default allRoutes;
