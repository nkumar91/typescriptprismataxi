import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/error.js";
import { generateBookingNumber } from "../../utils/utils.js";
import { 
    BookingResponse, 
    CancelBooking, 
    CreateBookingInput 
} from "./booking.types.js";

export const createNewBookingService = async (bookingData: CreateBookingInput, user_id: bigint): Promise<BookingResponse> => {
    if (!user_id) {
        throw new AppError("User Id is required to create a Booking", 400);
    }
    const availableCar = await prisma.car.findUnique({
        where:{
            id:bookingData.car_id
        }
    }) 
    if(availableCar?.status !== "available"){
        throw new AppError("Car is Not available for booking");
    }
    bookingData.user_id = user_id
    const bookingNum = generateBookingNumber();
    if (!bookingNum) {
        throw new AppError("Booking No. required to create a Booking", 400);
    }
    bookingData.booking_number = bookingNum;
    const _bookingCar = await prisma.booking.create({
        data: bookingData
    })
    return {
        ..._bookingCar
    };
}


export const getBookingDetailsService = async (bookingId: bigint): Promise<BookingResponse> => {
    const bookingData = await prisma.booking.findUnique({
        where: {
            id: bookingId
        }, include: {
            car: {
                include:{
                    car_image:true
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

export const cancelBookingService = async(
    bookingId:bigint,
    userId:bigint,
    cancelData:CancelBooking
):Promise<BookingResponse> =>{

    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            user_id: userId,
            cancelled_at:null,
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
            ...cancelData
        },
    });

    return updatedBooking;


  
}