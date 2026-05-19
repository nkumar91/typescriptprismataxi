import { NextFunction, Response } from "express";
import { RequestWithAdmin } from "../../middleware/admin.middleware.js";
import { validationResult } from "express-validator";
import { Coupon, CouponResponse } from "./price.types.js";
import { addCouponService } from "./price.service.js";
import { ApiResponse } from "../../utils/types.js";


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
export const deleteCouponController = async(
    req:RequestWithAdmin,
    res:Response,
    next:NextFunction
)=>{
    try{
        const {id} = req.params!;
        
    }
    catch(err){
        next(err);
    }
}
