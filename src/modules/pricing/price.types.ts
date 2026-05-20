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
    id?: bigint;
    coupon_id: bigint;
    user_id: bigint;
    booking_id: bigint;
    discount_applied: Prisma.Decimal;
    created_at?: Date | string | null;
};

export type CouponApply = {
    coupon_id?: bigint;
    code: string;
    booking_amount:number;
};

export type CouponResponse = Coupon & {
    coupon_usages?: CouponUsage[];
};

export type ParamsType = {
    id?:bigint
}

export type CouponUsageResponse = CouponUsage;

export type ApplyCouponResponse = {
    coupon_id?:bigint;
    code:string;
    type:string;
    value:Prisma.Decimal;
    discount_amount:Prisma.Decimal | null;
    booking_amount:Prisma.Decimal | null;
    final_amount:Prisma.Decimal | null;
}

export type PriceRequest = {
    car_id: bigint;
    start_date: Date | string;
    end_date: Date | string;
    coupon_code?: string | null;
};

export type CalculatePricing = {
        total_days: number,
        base_amount: Prisma.Decimal,
        surge_amount: Prisma.Decimal,
        tax_amount: Prisma.Decimal,
        security_deposit:Prisma.Decimal,
        discount_amount:Prisma.Decimal,
        total_amount:Prisma.Decimal,
}