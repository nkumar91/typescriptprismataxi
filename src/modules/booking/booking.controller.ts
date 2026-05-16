import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BookingParams, BookingResponse, CancelBooking, CreateBookingInput } from './booking.types.js';
import { RequestWithUser } from '../../middleware/auth.middleware.js';
import { cancelBookingService, createNewBookingService, getBookingDetailsService } from './booking.service.js';
import { AppError } from '../../utils/error.js';
import { ApiResponse } from '../../utils/types.js';

export const createNewBooking = async (
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
        const bookingData: CreateBookingInput = req.body!;
        const { userId } = req.user!;
        const bookingCarDetails = await createNewBookingService(bookingData, userId!);
        if (!bookingCarDetails) {
            throw new AppError("Failed to create new booking", 500);
        }
        const bookingResponse: ApiResponse<BookingResponse> = {
            status: "success",
            message: "Create Booking Successfully",
            data: bookingCarDetails
        }
        return res.status(201).json(bookingResponse);
    }
    catch (err) {
        next(err);
    }
}


export const getBookingDetailsById = async (
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
        const bookingParams: BookingParams = req.params!;
        const bookingCar = await getBookingDetailsService(bookingParams.id!);
        const responseData: ApiResponse<BookingResponse> = {
            status: "success",
            message: "Booking retrieved successfully",
            data: bookingCar
        }
        return res.status(200).json(responseData);

    }
    catch (err) {
        next(err);
    }
};



export const cancelBooking = async (
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
        const {userId} = req.user!;
        const cancelData:CancelBooking = req.body!;
        const bookingParams: BookingParams = req.params!;
        const result = await cancelBookingService(
            bookingParams.id!,
            userId!,
            cancelData!
        );
        const bookingResponse:ApiResponse<BookingResponse> = {
            status: "success",
            message: "Booking cancelled successfully",
            data: result,
        }
        return res.status(200).json(bookingResponse);  
    }
    catch (err) {
        next(err)
    }
}