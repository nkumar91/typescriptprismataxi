import { Response, NextFunction ,Request} from 'express';
import { CarImageResponse, CarResponse, CreateCarInput, paramsType } from './car.types.js';
import { createCarService, uploadCarImageService } from './car.service.js';
import { ApiResponse } from '../../utils/types.js';
import { handleHttpRequestInput, uploadToCloudinary } from '../../utils/utils.js';
import { AppError } from '../../utils/error.js';
import { RequestWithUser } from '../../middleware/vendor.middleware.js';

// Controller function to create a new car
export const createCar = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate input data here (e.g., using a validation library)
        await handleHttpRequestInput(req, res);
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
        const paramData:paramsType = req.params!;
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

// Additional controller functions (e.g., getAllCars, getCarById, updateCar, deleteCar) would be implemented similarly, following the same pattern of input validation, service layer interaction, and error handling.