import express from "express";
import authRouter from "../modules/auth/auth.router.js";
import userRouter from "../modules/user/user.router.js";
import carRouter from "../modules/car/car.router.js";
import bookingsRouter from "../modules/booking/booking.router.js";
import vendorRouter from "../modules/vendor/vendor.router.js";
const allRoutes = express.Router();

allRoutes.use("/auth",authRouter);
allRoutes.use("/user",userRouter);
allRoutes.use("/cars", carRouter);
allRoutes.use("/bookings",bookingsRouter);
allRoutes.use("/vendor",vendorRouter);

export default allRoutes;