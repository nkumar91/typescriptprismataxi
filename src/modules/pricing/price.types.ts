import { Prisma } from "../../generated/prisma/client.js";

export type CouponType = "flat" | "percentage";

export type Coupon = {
    id: bigint;
    code: string;
    type: CouponType;
    value: Prisma.Decimal;
    max_discount?: Prisma.Decimal | null;
    min_booking_amount: Prisma.Decimal;
    usage_limit?: number | null;
    used_count: number;
    user_limit: number;
    valid_from: Date;
    valid_until: Date;
    is_active?: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

export type CouponUsage = {
    id: bigint;
    coupon_id: bigint;
    user_id: bigint;
    booking_id: bigint;
    discount_applied: Prisma.Decimal;
    created_at?: Date | string | null;
};

export type CouponResponse = Coupon & {
    coupon_usages?: CouponUsage[];
};

export type CouponUsageResponse = CouponUsage;