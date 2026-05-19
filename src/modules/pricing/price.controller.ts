import { NextFunction, Response } from "express";
import { RequestWithAdmin } from "../../middleware/admin.middleware.js";
import { validationResult } from "express-validator";
import { ApplyCouponResponse, Coupon, CouponApply, CouponResponse, CouponUsage, ParamsType } from "./price.types.js";
import { addCouponService, applyCouponService, deleteCouponService, getAllCouponsService } from "./price.service.js";
import { ApiResponse } from "../../utils/types.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/error.js";
import { RequestWithUser } from "../../middleware/auth.middleware.js";


// create a new coupon
export const createCouponController = async (
    req: RequestWithAdmin,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            return res.status(400).json({
                status: "failed",
                message: errorMessages
            });
        }
        const couponDetails: Coupon = req.body!;
        const couponData = await addCouponService(couponDetails);
        const responseData: ApiResponse<CouponResponse> = {
            status: "success",
            message: "coupon details",
            data: couponData
        }
        return res.status(201).json(responseData);
    } catch (err) {
        next(err);
    }

}

//delete coupon controller
export const deleteCouponController = async (
    req: RequestWithAdmin,
    res: Response,
    next: NextFunction
) => {
    try {
        const paramsData: ParamsType = req.params!;
        if (!paramsData.id) {
            throw new AppError("Coupon id is required", 400);
        }
        const deleteCoupon = await deleteCouponService(paramsData.id!);
        const responseData: ApiResponse<CouponResponse> = {
            status: "success",
            message: "deleted",
            data: deleteCoupon
        }
        return res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}

// get all coupons controller
export const getAllCouponController = async (
    req: RequestWithAdmin,
    res: Response,
    next: NextFunction
) => {
    try {
        let { page, limit } = req.query!;
        const { coupons, pagination } = await getAllCouponsService(Number(page), Number(limit));
        const responseData: ApiResponse<CouponResponse[]> = {
            status: "success",
            message: "List all coupons",
            data: coupons,
            pagination: pagination
        }
        return res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}


export const applyCouponController = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            return res.status(400).json({
                status: "failed",
                message: errorMessages
            });
        }
        const { userId } = req.user!;
        if (!userId) {
            throw new AppError("User id is required !", 400);
        }
        const coupon: CouponApply = req.body!;
        const couponDetail = await applyCouponService(userId, coupon);
        const responseData: ApiResponse<ApplyCouponResponse> = {
            status: "success",
            message: "Coupon applied",
            data: {
               ...couponDetail
            },
        }

        return res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}