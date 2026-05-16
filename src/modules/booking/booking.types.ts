import { Prisma } from "../../generated/prisma/client.js";

export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";

export type CreateBookingInput = {
	booking_number: string;
	user_id: bigint;
	car_id: bigint;
	pickup_location_id: bigint;
	drop_location_id: bigint;
	start_date: Date | string;
	end_date: Date | string;
	total_days: number;
	base_amount: Prisma.Decimal;
	discount_amount?: Prisma.Decimal;
	surge_amount?: Prisma.Decimal;
	tax_amount: Prisma.Decimal;
	total_amount: Prisma.Decimal;
	security_deposit?: Prisma.Decimal;
	coupon_id?: bigint | null;
	status?: BookingStatus;
	cancellation_reason?: string | null;
	cancelled_at?: Date | string | null;
	notes?: string | null;
};

export type UpdateBookingInput = {
	// booking_number?: string;
	start_date?: Date | string;
	end_date?: Date | string;
	total_days?: number;
	base_amount?: Prisma.Decimal;
	discount_amount?: Prisma.Decimal | null;
	surge_amount?: Prisma.Decimal | null;
	tax_amount?: Prisma.Decimal;
	total_amount?: Prisma.Decimal;
	security_deposit?: Prisma.Decimal | null;
	coupon_id?: bigint | null;
	status?: BookingStatus;
	cancellation_reason?: string | null;
	cancelled_at?: Date | string | null;
	notes?: string | null;
};

export type UserDetails={
    id:bigint,
    name:string,
    avatar?:string
}

export type CancelBooking = {
    cancellation_reason?:string | null
}


export type BookingResponse = {
	id: bigint;
	booking_number: string;
	user_id: bigint;
	car_id: bigint;
	pickup_location_id: bigint;
	drop_location_id: bigint;
	start_date: Date;
	end_date: Date;
	total_days: number;
	base_amount: Prisma.Decimal;
	discount_amount?: Prisma.Decimal | null;
	surge_amount?: Prisma.Decimal | null;
	tax_amount: Prisma.Decimal;
	total_amount: Prisma.Decimal;
	security_deposit?: Prisma.Decimal | null;
	coupon_id?: bigint | null;
	status: BookingStatus;
	cancellation_reason?: string | null;
	cancelled_at?: Date | null;
	notes?: string | null;
	created_at?: Date | null;
	updated_at?: Date | null;
    user_deatils?:UserDetails[]

};

export type BookingParams = {
	id?: bigint;
	booking_number?: string;
};

