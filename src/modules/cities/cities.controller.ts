import { NextFunction, Response } from "express";
import { RequestWithAdmin } from "../../middleware/admin.middleware.js";
import { validationResult } from "express-validator";
import { CityParams, CityResponse, CreateCityInput, CreateLocationInput, LocationResponse } from "./cities.types.js";
import { createCityService, createLocationService, getAllCitieService, getLocationService } from "./cities.service.js";
import { ApiResponse } from "../../utils/types.js";
import { RequestWithUser } from "../../middleware/auth.middleware.js";

export const createCityController = async (
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
        const cityInput:CreateCityInput = req.body!;
        const city = await createCityService(cityInput);
        const responseData:ApiResponse<CityResponse> = {
            status:"success",
            message:"city added",
            data:city
        }
        return res.status(201).json(responseData);
    }
    catch (err) {
        next(err);
    }
}


export const createLocationController = async (
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
        const city_id:CityParams = req.params;
        const locationInput:CreateLocationInput = req.body!;
        const city = await createLocationService(locationInput,city_id.id!);
        const responseData:ApiResponse<LocationResponse> = {
            status:"success",
            message:"location added",
            data:city
        }
        return res.status(201).json(responseData);
    }
    catch (err) {
        next(err);
    }
}


export const getCitiesController = async(
    req:RequestWithUser,
    res:Response,
    next:NextFunction
)=>{
    try{
          let { page, limit } = req.query!;
        const allCities = await getAllCitieService(Number(page), Number(limit));
        const responseData:ApiResponse<CityResponse[]> =  {
            status:"success",
            message:"all cities",
            data:allCities
        }
        return res.status(200).json(responseData);
    }
    catch(err){
        next(err);
    }
}


export const getLocationController = async(
    req:RequestWithUser,
    res:Response,
    next:NextFunction
)=>{
    try{
        const city:CityParams = req.params;
        const location = await getLocationService(city.id!);
        const responseData:ApiResponse<LocationResponse[]> =  {
            status:"success",
            message:"all cities",
            data:location
        }
        return res.status(200).json(responseData);
    }
    catch(err){
        next(err);
    }
}