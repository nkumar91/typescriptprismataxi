import express from "express";
import authRouter from "../modules/auth/auth.router.js";
import userRouter from "../modules/user/user.router.js";
import carRouter from "../modules/car/car.router.js";
const allRoutes = express.Router();

allRoutes.use("/auth",authRouter);
allRoutes.use("/user",userRouter);
allRoutes.use("/car", carRouter);

export default allRoutes;