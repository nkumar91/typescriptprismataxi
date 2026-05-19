import {Router} from "express";
import * as userController from "./user.controller.js";
import { createLimiter } from "../../middleware/ratelimit.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { cloud } from "./user.middleware.js";
const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get(
  "/profile", 
  createLimiter(1,60),
  userController.getUserProfile
);
userRouter.put(
  "/profile", 
  createLimiter(1,30),
  userController.updateUserProfile
);
userRouter.post(
  "/kyc", 
  createLimiter(1,10),
  cloud.fields([
    { name: 'front_image', maxCount: 1 },
    { name: 'back_image', maxCount: 1 }
  ]),
  userController.submitKYC
);
userRouter.get(
  "/kyc/status", 
  createLimiter(1,60),
  userController.getKYCStatus
);
userRouter.get(
  "/bookings", 
  createLimiter(1,60),
  userController.getUserBookings
);
userRouter.put(
  "/password", 
  createLimiter(1,10),
  userController.changePassword
);
export default userRouter;