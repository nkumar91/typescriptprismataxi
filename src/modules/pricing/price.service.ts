import { prisma } from "../../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../utils/error.js";
import { Coupon, CouponApply, CouponResponse } from "./price.types.js";

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
export const getAllCouponsService = async (
    page: number,
    limit: number
) => {
    if (!page) {
        page = 1;
    }
    if (!limit) {
        limit = 50;
    }
    const skip = (page - 1) * limit;
    const [coupons, totalCoupons] =
        await Promise.all([
            prisma.coupon.findMany({
                skip,
                take: limit,
                orderBy: {
                    created_at: "desc",
                },
            }),
            prisma.coupon.count(),
        ]);
    const totalPages = Math.ceil(totalCoupons / limit);
    return {
        coupons,
        pagination: {
            total: totalCoupons,
            page,
            limit,
            totalPages,
        },
    };
};
export const applyCouponService = async (
    userId: bigint,
    couponDetails: CouponApply
) => {
    const validateCoupon = await prisma.coupon.findFirst({
        where: {
            code: couponDetails.code,
            is_active: true,
            valid_from: {
                lte: new Date(),
            },
            valid_until: {
                gte: new Date(),
            },
        },
    });
    if (!validateCoupon) {
        throw new AppError(
            "Invalid or expired coupon",
            400
        );
    }
    const usageCount = await prisma.couponUsage.count({
        where: {
            coupon_id: validateCoupon.id,
            user_id: userId,
        }
    });
    if (usageCount >= validateCoupon.user_limit) {
        throw new AppError(
            "Coupon usage limit exceeded",
            400
        );
    }
    // const alreadyUsed = await prisma.couponUsage.findFirst({
    //     where: {
    //         coupon_id: validateCoupon.id,
    //         user_id: userId,
    //     },
    // });
    // if (alreadyUsed && validateCoupon.user_limit === 1) {
    //     throw new AppError(
    //         "Coupon already used",
    //         400
    //     );
    // }
    if (couponDetails.booking_amount < Number(validateCoupon.min_booking_amount)) {
        throw new AppError(
            `Minimum booking amount should be ${validateCoupon.min_booking_amount}`,
            400
        );
    }
    let discount = 0;
    if (validateCoupon.type === "percentage") {
        discount = (couponDetails.booking_amount * Number(validateCoupon.value)) / 100;
    }
    else if (validateCoupon.type === "flat") {
        discount = Number(validateCoupon.value);
    }
    return {
        coupon_id: validateCoupon.id,
        code: validateCoupon.code,
        type: validateCoupon.type,
        value: Prisma.Decimal(validateCoupon.value),
        discount_amount: Prisma.Decimal(discount),
        booking_amount: Prisma.Decimal(couponDetails.booking_amount),
        final_amount: Prisma.Decimal(couponDetails.booking_amount-discount)
    };

}