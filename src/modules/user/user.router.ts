import express from "express";
import * as userController from "./user.controller.js";
import { createLimiter } from "../../middleware/ratelimit.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { cloud } from "./user.middleware.js";
const userRouter = express.Router();

userRouter.use(requireAuth);
userRouter.get(
  "/profile", 
  createLimiter(1,60),
  userController.getUserProfile
);

userRouter.post(
  "/kyc", 
  createLimiter(1,60),
  cloud.fields([
    { name: 'front_image', maxCount: 1 },
    { name: 'back_image', maxCount: 1 }
  ]),
  userController.submitKYC
);

export default userRouter;