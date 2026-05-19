import {Router}  from "express";
import { requireAdminAuth } from "../../middleware/admin.middleware.js";
import { createLimiter } from "../../middleware/ratelimit.middleware.js";
import { couponIdParamValidation, couponInputValidation, couponUsageInputValidation, pageQueryValidation } from "./price.validator.js";
import * as CouponController from "./price.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
const priceRouter = Router();

//create coupon routes
priceRouter.post(
    "/coupons",
    createLimiter(1,10),
    couponInputValidation,
    requireAdminAuth,
    CouponController.createCouponController
);

//delete coupon routes
priceRouter.delete(
    "/coupons/:id",
    createLimiter(1,10),
    couponIdParamValidation,
    requireAdminAuth,
    CouponController.deleteCouponController
);

//get all coupons
priceRouter.get(
    "/coupons",
    createLimiter(1,60),
    requireAdminAuth,
    pageQueryValidation,
    CouponController.getAllCouponController
);

// apply coupon
priceRouter.post(
    "/coupon/apply",
    createLimiter(1,20),
    requireAuth,
    couponUsageInputValidation,
    CouponController.applyCouponController
);

export default priceRouter;