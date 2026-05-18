import { prisma } from "../../config/db.js";
import { env } from "../../config/env.js";
import { Prisma } from "../../generated/prisma/client.js";
import { VendorCreateInput } from "../../generated/prisma/models.js";
import { AppError } from "../../utils/error.js";
import {
    BankAccountDetails,
    BookingResponse,
    CarFeatures,
    CarResponse,
    createVendorInput,
    VendorResponse
} from "./vendor.types.js";

export const createNewVendorService = async (
    userId: bigint,
    inputData: createVendorInput
): Promise<VendorResponse> => {
    if (!userId) {
        throw new AppError("User ID is required to create a car", 400);
    }
    const vendorExists = await prisma.vendor.findUnique({
        where: {
            user_id: userId
        }
    })
    if (vendorExists) {
        throw new AppError("Vendor Account is already created!!", 500);
    }
    const createVendor: VendorCreateInput = {
        user_id: userId,
        business_name: inputData.business_name,
        gst_number: inputData.gst_number!,
        pan_number: inputData.pan_number!,
        commission_rate: Number(env.PLATFORM_FEE)!
    }
    if (inputData.bank_account !== undefined) {
        createVendor.bank_account = inputData.bank_account === null ? Prisma.JsonNull : inputData.bank_account;
    }
    const newVendor = await prisma.vendor.create({
        data: createVendor
    })
    return {
        ...newVendor,
        bank_account: newVendor.bank_account as BankAccountDetails,
    };
}

export const getProfileAvaialable = async (
    vendorId: bigint
): Promise<VendorResponse> => {
    const getProfile = await prisma.vendor.findUnique({
        where: {
            id: vendorId
        }
    })
    if (!getProfile) {
        throw new AppError("Profile not found or has been deleted", 404);
    }

    return {
        ...getProfile,
        bank_account: getProfile.bank_account as BankAccountDetails,
    }
}


export const vendorCarListService = async (
    vendorId: bigint
): Promise<CarResponse[]> => {
    if (!vendorId) {
        throw new AppError("Vendor id is required", 400);
    }
    const getCars = await prisma.car.findMany({
        where: {
            vendor_id: vendorId
        },
        include: {
            car_image: true,
            location: true,
            city: true
        },
    });

    if (!getCars) {
        throw new AppError("Car Details not found", 404);
    }
    return getCars.map((car) => ({
        ...car,
        features: car.features as CarFeatures,
    }))

}


export const vendorGetAllBookingService = async (
    vendorId: bigint
):Promise<BookingResponse[]> => {
    if (!vendorId) {
        throw new AppError("Vendor id is required", 400);
    }
    const bookings = await prisma.booking.findMany({
        where: {
            car: {
                vendor_id: vendorId,
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    mobile: true,
                },
            },
            car: {
                include: {
                    car_image: true,
                },
            },
            pickup_location: true,
            drop_location: true,
        },
        orderBy: {
            created_at: "desc",
        },
    });
     if (!bookings) {
        throw new AppError("Booking Details not found", 404);
    }
    return bookings.map((booking) => ({
        ...booking,

        car: {
            ...booking.car,

            features:
                booking.car.features as CarFeatures,
        },
    }));
}