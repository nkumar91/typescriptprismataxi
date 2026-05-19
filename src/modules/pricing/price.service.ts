import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/error.js";
import { Coupon, CouponResponse } from "./price.types.js";

export const addCouponService = async (
    couponData: Coupon
): Promise<CouponResponse> => {
    const existingCoupon = await prisma.coupon.findFirst({
        where: {
            code: couponData.code
        },
    });
    if (existingCoupon) {
        throw new AppError("Coupon with the same Coupon Code or Coupon already exists", 400);
    }
    const addCoupon = await prisma.coupon.create({
        data: couponData
    });
    return addCoupon
}


export const deleteCouponService = async (
    id: bigint
): Promise<CouponResponse> => {
    if (!id) {
        throw new AppError("Coupon ID is required to delete a Coupon", 400);
    }
    const coupon = await prisma.coupon.findFirst({
        where: {
            id: id,
            is_active: true,
        },
    });
    if (!coupon) {
        throw new AppError(
            "Coupon not found",
            404
        );
    }
    const updatedCoupon =
        await prisma.coupon.update({
            where: {
                id: id,
            },
            data: {
                is_active: false,
            },
        });
    return updatedCoupon;
}