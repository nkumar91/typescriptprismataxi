import { Response, NextFunction, Request } from 'express';
import { CarImageResponse, CarResponse, CarStatus, CreateCarInput, paramsType, UpdateCarInput } from './car.types.js';
import {
    createCarService,
    deleteCarImageService,
    deleteCarService,
    getAllCarsService,
    getCarAvailabilityService,
    getCarByIdService,
    getCarsByCityService,
    updateCarService,
    updateCarStatusService,
    uploadCarImageService
} from './car.service.js';
import { ApiResponse } from '../../utils/types.js';
import { uploadToCloudinary } from '../../utils/utils.js';
import { AppError } from '../../utils/error.js';
import { RequestWithUser } from '../../middleware/vendor.middleware.js';
import { validationResult } from 'express-validator';
import { env } from '../../config/env.js';


// Controller function to create a new car
export const createCar = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate input data here (e.g., using a validation library)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            return res.status(400).json({
                status: "failed",
                message: errorMessages
            });
        }
        const carData: CreateCarInput = req.body;
        const { vendorId } = req.user!;
        // Call service layer to create the car
        const newCar = await createCarService(carData, vendorId!);
        // Respond with the created car data
        if (!newCar) {
            throw new AppError("Failed to create car", 500);
        }
        const { ...carResponse } = newCar; // Transform to CarResponse if needed
        const responseData: ApiResponse<CarResponse> = {
            status: 'success',
            message: 'Car created successfully',
            data: carResponse
        };
        return res.status(201).json(responseData);
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};

export const updateCar = async (
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
        const paramData: paramsType = req.params!;
        if (!paramData.id) {
            throw new AppError("Car ID is required");
        }
        const carData: UpdateCarInput = req.body;
        // Call service layer to update the car
        const updatedCar = await updateCarService(paramData.id, carData);
        if (!updatedCar) {
            throw new AppError("Failed to update car", 500);
        }
        // Respond with the updated car data
        const responseData: ApiResponse<CarResponse> = {
            status: 'success',
            message: 'Car updated successfully',
            data: updatedCar
        };
        return res.status(200).json(responseData);
    }
    catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};


export const uploadCarImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Assuming the image data is sent in the request body
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };
        const url = files?.url?.[0];
        const thumbnail_url = files?.thumbnail_url?.[0] || null;

        if (!url) {
            throw new AppError("Car Image is required");
        }
        const paramData: paramsType = req.params!;
        if (!paramData.id) {
            throw new AppError("Car ID is required");
        }
        const [_url, _thumbnail_url] =
            await Promise.all([
                uploadToCloudinary(
                    url.buffer,
                    "upload/cars"
                ),
                thumbnail_url ? uploadToCloudinary(
                    thumbnail_url.buffer,
                    "upload/cars"
                ) : Promise.resolve(null),
            ]);
        // Call service layer to upload the car image
        const newImage = await uploadCarImageService(paramData.id, _url, _thumbnail_url!);
        // Respond with the uploaded image data
        const responseData: ApiResponse<CarImageResponse> = {
            status: 'success',
            message: 'Car image uploaded successfully',
            data: newImage
        };
        return res.status(201).json(responseData);
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};


export const getAllCars = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Call service layer to get all cars
        const limit = Number(env.PAGE_LIMIT || 20); // Default to 20 if not set in environment variables
        const page = Number(req.query.page_no) || 1;
        const {totalPages,currentPage,page_size,data} = await getAllCarsService(limit,page); // Default to 20 cars
        // Respond with the list of cars
        const responseData: ApiResponse<CarResponse[]> = {
            status: 'success',
            message: 'Cars retrieved successfully',
            total_page:totalPages,
            current_page:currentPage,
            page_size:page_size,
            data: data
        };
        return res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};


export const getCarAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Implement logic to check a car's availability
        const paramData: paramsType = req.params!;
        if (!paramData.id) {
            throw new AppError("Car ID is required");
        }
        // Call service layer to get the car's availability
        const availability = await getCarAvailabilityService(paramData.id);
        // Respond with the car's availability status
        const responseData: ApiResponse<{ available: boolean; status: CarStatus }> = {
            status: 'success',
            message: 'Car availability retrieved successfully',
            data: {
                available: availability.available,
                status: availability.status
            }
        };
        return res.status(200).json(responseData);
    }
    catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};


export const getCarById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Implement logic to get a car by its ID
        const paramData: paramsType = req.params!;
        if (!paramData.id) {
            throw new AppError("Car ID is required");
        }
        //Call service layer to get the car by ID
        const car = await getCarByIdService(paramData.id);
        if (!car) {
            throw new AppError("Car not found", 404);
        }
        //Respond with the car data
        const responseData: ApiResponse<CarResponse> = {
            status: 'success',
            message: 'Car retrieved successfully',
            data: car
        };
        return res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};


export const deleteCar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Implement logic to delete a car by its ID
        const paramData: paramsType = req.params!;
        if (!paramData.id) {
            throw new AppError("Car ID is required");
        }
        // Call service layer to delete the car by ID
        const deletedCar = await deleteCarService(paramData.id);
        // Respond with a success message
        const responseData: ApiResponse<CarResponse> = {
            status: 'success',
            message: 'Car deleted successfully',
            data: deletedCar
        };
        return res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};


export const deleteCarImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Implement logic to delete a car image by its ID
        const paramData: paramsType = req.params!;
        if (!paramData.id || !paramData.imgId) {
            throw new AppError("Car ID and Image ID are required");
        }
        // Call service layer to delete the car image by ID
        await deleteCarImageService(paramData.imgId!);
        // Respond with a success message
        const responseData: ApiResponse<null> = {
            status: 'success',
            message: 'Car image deleted successfully',
            data: null
        };
        return res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};


export const updateCarStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Implement logic to update a car's status
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            return res.status(400).json({
                status: "failed",
                message: errorMessages
            });
        }
        const paramData: paramsType = req.params!;
        if (!paramData.id) {
            throw new AppError("Car ID is required");
        }
        const { status } = req.body;
        if (!status) {
            throw new AppError("Car status is required");
        }
        // Call service layer to update the car's status
        const updatedCar = await updateCarStatusService(paramData.id, status);
        // Respond with the updated car data
        const responseData: ApiResponse<CarResponse> = {
            status: 'success',
            message: 'Car status updated successfully',
            data: updatedCar
        };
        return res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};


export const getCarsByCity = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const paramData: paramsType = req.params!;
        if (!paramData.cityId) {
            throw new AppError("City ID is required");
        }
        // Call service layer to get cars by city ID
        const cars = await getCarsByCityService(paramData.cityId);
        // Respond with the list of cars in the specified city
        const responseData: ApiResponse<CarResponse[]> = {
            status: 'success',
            message: 'Cars retrieved successfully for the specified city',
            data: cars
        };
        return res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};
// Additional controller functions (e.g., getCarById, updateCar, deleteCar) can be implemented similarly