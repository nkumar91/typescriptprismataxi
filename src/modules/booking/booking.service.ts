import { prisma } from "../../config/db.js";
import { env } from "../../config/env.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../utils/error.js";
import { calculateTotalDays, generateBookingNumber } from "../../utils/utils.js";
import {
    BookingResponse,
    CancelBooking,
    CreateBookingInput
} from "./booking.types.js";

export const createNewBookingService = async (
    bookingData: CreateBookingInput,
    user_id: bigint
): Promise<BookingResponse> => {
    if (!user_id) {
        throw new AppError("User Id is required to create a Booking", 400);
    }
    const availableCar = await prisma.car.findUnique({
        where: {
            id: bookingData.car_id
        }
    })
    if (availableCar?.status !== "available") {
        throw new AppError("Car is Not available for booking");
    }
    bookingData.user_id = user_id
    //generate random booking no BK-
    const bookingNum = generateBookingNumber();
    if (!bookingNum) {
        throw new AppError("Booking No. required to create a Booking", 400);
    }
    bookingData.booking_number = bookingNum;
    // calculate total days
    const totalDays = calculateTotalDays(
        new Date(bookingData.start_date),
        new Date(bookingData.end_date)
    );
    bookingData.total_days = totalDays;
    //calculate base amount
    const base_amount = new Prisma.Decimal(
        totalDays * Number(availableCar.price_per_day)
    );
    bookingData.base_amount = base_amount;
    //calculate surge amount
    let surge_amount = new Prisma.Decimal(0);
    const isWeekend =
        [0, 6].includes(new Date().getDay());
    if (isWeekend) {
        surge_amount = availableCar.price_per_day.mul(env.SURGE_PER); // 20%
    }
    bookingData.surge_amount = surge_amount;
    //tax amount
    const sub_total = base_amount.plus(surge_amount);
    const tax_amount = sub_total.mul(env.GST_PER).div(100);
    bookingData.tax_amount = tax_amount;
    //total amount
    const total_amount = sub_total.plus(tax_amount);
    bookingData.total_amount = total_amount

    if (bookingData.coupon_id) {
        const couponDetails = await prisma.coupon.findFirst({
            where: {
                id: bookingData.coupon_id,
                is_active: true,
            }
        })
        if (!couponDetails) {
            throw new AppError("Invalid Coupon Code", 400);
        }
        if (couponDetails.valid_until < new Date()) {
            throw new AppError("Coupon Code has expired", 400);
        }
        if (couponDetails.type === "percentage") {
            const discount_amount = total_amount.mul(couponDetails.value).div(100);
            bookingData.discount_amount = discount_amount;
            bookingData.total_amount = total_amount.minus(discount_amount);
        } else if (couponDetails.type === "flat") {
            const discount_amount = new Prisma.Decimal(couponDetails.value);
            bookingData.discount_amount = discount_amount;
            bookingData.total_amount = total_amount.minus(discount_amount);
        }
    }


    const _bookingCar = await prisma.booking.create({
        data: bookingData
    })
    if (bookingData.coupon_id) {
        const couponUsageData = {
            user_id: user_id,
            coupon_id: bookingData.coupon_id!,
            booking_id: _bookingCar.id,
            discount_applied: bookingData.discount_amount || new Prisma.Decimal(0),
        }
        await prisma.couponUsage.create({
            data: couponUsageData
        });
    }
    return {
        ..._bookingCar
    };
}


export const getBookingDetailsService = async (
    bookingId: bigint
): Promise<BookingResponse> => {
    const bookingData = await prisma.booking.findUnique({
        where: {
            id: bookingId
        }, include: {
            car: {
                include: {
                    car_image: true
                }
            },
            pickup_location: {
                include: {
                    city: true,
                },
            },
            drop_location: {
                include: {
                    city: true,
                },
            },
        }

    });
    if (!bookingData) {
        throw new AppError("Booking not found or has been deleted", 404);
    }
    return {
        ...bookingData
    };
}

export const cancelBookingService = async (
    bookingId: bigint,
    userId: bigint,
    cancelData: CancelBooking
): Promise<BookingResponse> => {
    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            user_id: userId,
            cancelled_at: null,
        },
    });
    if (!booking) {
        throw new AppError("Booking not found", 404);
    }
    if (new Date(booking.start_date) <= new Date()) {
        throw new AppError(
            "Booking already started, cannot cancel",
            400
        );
    }
    const updatedBooking = await prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            cancelled_at: new Date(),
            status: "cancelled",
            ...cancelData
        },
    });
    return updatedBooking;
}


export const extendBookingService = async (
    userId: bigint,
    bookingId: bigint,
    new_date: Date
) => {
    const bookinDetails = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            user_id: userId,
            status: {
                in: ["pending", "confirmed", "active"],
            },
        },
        include: {
            car: true,
        },
    });
    if (!bookinDetails) {
        throw new AppError("Booking not found", 404);
    }
    if (new_date <= bookinDetails.end_date) {
        throw new AppError(
            "New end date must be greater than current end date",
            400
        );
    }
    const conflictingBooking = await prisma.booking.findFirst({
        where: {
            car_id: bookinDetails.car_id,
            id: {
                not: bookinDetails.id,
            },
            status: {
                in: ["pending", "confirmed", "active"],
            },
            start_date: {
                lte: new_date,
            },
            end_date: {
                gte: bookinDetails.end_date,
            },
        },
        select: {
            id: true,
        },
    });
    if (conflictingBooking) {
        throw new AppError(
            "Car already booked for selected extension period",
            400
        );
    }

    const carDetails = await prisma.car.findUnique({
        where: {
            id: bookinDetails.car_id
        }
    })
    if (!carDetails) {
        throw new AppError("Car Details Not Found !", 404);
    }
    // total days
    const totalDays = calculateTotalDays(
        new Date(new Date(new_date)),
        new Date(bookinDetails.start_date)
    );
    //calculate base amount
    const base_amount = new Prisma.Decimal(
        totalDays * Number(carDetails.price_per_day)
    );
    //calculate surge amount
    let surge_amount = new Prisma.Decimal(0);
    const isWeekend =
        [0, 6].includes(new Date().getDay());
    if (isWeekend) {
        surge_amount = carDetails.price_per_day.mul(env.SURGE_PER); // 20%
    }
    //tax amount
    const sub_total = base_amount.plus(surge_amount);
    const tax_amount = sub_total.mul(env.GST_PER).div(100);
    //total amount
    const total_amount = sub_total.plus(tax_amount);
    const updatedBooking = await prisma.booking.update({
        where: {
            id: bookinDetails.id,
        },
        data: {
            end_date: new_date,
            total_days: totalDays,
            base_amount: base_amount,
            tax_amount: tax_amount,
            surge_amount: surge_amount,
            total_amount: total_amount
        },
    });

    return updatedBooking;
}