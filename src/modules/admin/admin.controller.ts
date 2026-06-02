import { NextFunction, Response } from "express";
import { RequestWithAdmin } from "../../middleware/admin.middleware.js";
import { 
    approveKycService, 
    getAllBookingsService, 
    getAllKycPendingService, 
    getUserHistoryService, 
    getUsersHistoryService, 
    rejectKycService, 
    updateUserHistoryService 
} 
    from "./admin.service.js";
import { BookingResponse, GetUserResponse, KycStatusResponse, QueryParams } from "./admin.types.js";
import { ApiResponse } from "../../utils/types.js";
import { validationResult } from "express-validator";

export const getAllUsersController = async (
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
        const queryData: QueryParams = req.query;
        const userData = await getUsersHistoryService(queryData.page!, queryData.limit!);
        const responseData: ApiResponse<GetUserResponse[]> = {
            status: "success",
            message: "users",
            data: userData.users,
            page_size: userData.limit,
            total_page: userData.totalPages,
            current_page: userData.page,
            total_users: userData.totalUsers
        }
        res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}


export const getUserController = async (
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
        const queryData: QueryParams = req.params;
        const userData = await getUserHistoryService(queryData.id!);
        const responseData: ApiResponse<GetUserResponse> = {
            status: "success",
            message: "users",
            data: userData
        }
        res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}


export const updateUserController = async (
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
        const queryData: QueryParams = req.params;
        const userData = await updateUserHistoryService(queryData.id!);
        const responseData: ApiResponse<GetUserResponse> = {
            status: "success",
            message: "users",
            data: userData
        }
        res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}


export const getAllPendingKycController = async (
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
        const queryData: QueryParams = req.query;
        const kycDoc = await getAllKycPendingService(queryData.page!, queryData.limit!);
        const responseData: ApiResponse<KycStatusResponse[]> = {
            status: "success",
            message: "All pending kyc list",
            data: kycDoc.kyc,
            page_size: kycDoc.limit,
            total_page: kycDoc.totalPages,
            current_page: kycDoc.page,
            total_items: kycDoc.totalPendingKyc
        }
        res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}


export const approveKycController = async (
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
        const queryData: QueryParams = req.params;
        const kycData = await approveKycService(queryData.id!);
        const responseData: ApiResponse<KycStatusResponse> = {
            status: "success",
            message: "users",
            data: kycData
        }
        res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}

export const rejectKycController = async (
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
        const queryData: QueryParams = req.params;
        const kycData = await rejectKycService(queryData.id!);
        const responseData: ApiResponse<KycStatusResponse> = {
            status: "success",
            message: "users",
            data: kycData
        }
        res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}


export const getAllBookingsController = async (
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
        const queryData: QueryParams = req.query;
        const bookingData = await getAllBookingsService(queryData.page!, queryData.limit!);
        const responseData: ApiResponse<BookingResponse[]> = {
            status: "success",
            message: "All bookings list",
            data: bookingData.bookings,
            page_size: bookingData.limit,
            total_page: bookingData.totalPages,
            current_page: bookingData.page,
            total_items: bookingData.totalBookings
        }
        res.status(200).json(responseData);
    }
    catch (err) {
        next(err);
    }
}