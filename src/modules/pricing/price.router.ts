import {Router}  from "express";
import { requireAdminAuth } from "../../middleware/admin.middleware.js";
import { createLimiter } from "../../middleware/ratelimit.middleware.js";
import { couponIdParamValidation } from "./price.validator.js";
import * as CouponController from "./price.controller.js";
const priceRouter = Router();

//create coupon routes
priceRouter.post(
    "/coupons",
    createLimiter(1,10),
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

export default priceRouter;