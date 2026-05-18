import { NextFunction, Response } from "express";
import { RequestWithUser } from "../../middleware/auth.middleware.js";
import { validationResult } from "express-validator";
import { BookingResponse, CarResponse, createVendorInput, VendorResponse } from "./vendor.types.js";
import { createNewVendorService, getProfileAvaialable, vendorCarListService, vendorGetAllBookingService } from "./vendor.service.js";
import { AppError } from "../../utils/error.js";
import { ApiResponse } from "../../utils/types.js";
import { RequestWithVendor } from "../../middleware/vendor.middleware.js";

export const vendorOnBoardController = async (
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
        const { userId } = req.user!;
        const vendorInput: createVendorInput = req.body!;
        const vendorData = await createNewVendorService(userId!, vendorInput);
        if (!vendorData) {
            throw new AppError("Failed to create vendor", 500);
        }
        const vendorResponseData:ApiResponse<VendorResponse> = {
            status:"success",
            message:"Vendor Created Successfully",
            data:vendorData!
        }
        return res.status(201).json(vendorResponseData);

    }
    catch (err) {
        next(err);
    }
};

export const vendorProfileController = async(
    req:RequestWithVendor,
    res:Response,
    next:NextFunction
) =>{
    try{
        const {vendorId} = req.user!;
        if(!vendorId){
             throw new AppError("Vendor ID is required to get a profile", 400);
        }
        const vendorProfile = await getProfileAvaialable(vendorId);
        if(!vendorProfile){
            throw new AppError("Failed to fetch profile", 500); 
        }
        const responseData:ApiResponse<VendorResponse> = {
                status:"success",
                message:"Vendor profile get successfully",
                data:vendorProfile
        }
        return res.status(200).json(responseData);
    }
    catch(err){
        next(err);
    }
};


export const vendorCarController = async(
    req:RequestWithVendor,
    res:Response,
    next:NextFunction
) =>{
    try{
            const {vendorId}  = req.user!;
            const carList = await vendorCarListService(vendorId!);
            const responseData:ApiResponse<CarResponse[]> = {
                status:"success",
                message:"Car Deatils",
                data:carList
            }

            return res.status(200).json(responseData);
            
    }
    catch(err){
        next(err);
    }
};


export const vendorBookingController = async(
    req:RequestWithVendor,
    res:Response,
    next:NextFunction
) =>{
    try{
        const {vendorId} = req.user!;
        const allBookings = await vendorGetAllBookingService(vendorId!);
        const responseData:ApiResponse<BookingResponse[]>={
            status:"success",
            message:"Booking Details",
            data:allBookings
        }
        return res.status(200).json(responseData);
    }
    catch(err){
        next(err);
    }
};

export const vendorRevenueController = async(
    req:RequestWithVendor,
    res:Response,
    next:NextFunction
) =>{
   try{
      console.warn(""); 
    }
    catch(err){
        next(err);
    }
};
