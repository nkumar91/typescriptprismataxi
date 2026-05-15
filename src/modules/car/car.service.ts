
import { prisma } from "../../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { CarCreateInput } from "../../generated/prisma/models.js";
import { AppError } from "../../utils/error.js";
import { 
    CarFeatures, 
    CarResponse, 
    CreateCarInput 
} from "./car.types.js";
import { randomUUID } from "crypto";
export const createCarService = async (
    carData: CreateCarInput,
    vendorId: bigint,
): Promise<CarResponse> => {
    if (!vendorId) {
        throw new AppError("Vendor ID is required to create a car", 400);
    }

    const uuid = randomUUID();
    if (!uuid) {
        throw new AppError("Failed to generate UUID", 500);
    }

    const createData: CarCreateInput = {
        uuid,
        vendor_id: vendorId,
        city_id: carData.city_id,
        name: carData.name,
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        price_per_day: carData.price_per_day,
        security_deposit: carData.security_deposit,
        seats: carData.seats!,
        location_id: carData.location_id!,
        fuel_type: carData.fuel_type!,
        transmission: carData.transmission!,
        status: carData.status!,
        description: carData.description!,
        mileage: carData.mileage!,
        is_featured: carData.is_featured!,
    };
    if (carData.features !== undefined) {
        createData.features = carData.features === null ? Prisma.JsonNull : carData.features;
    }
    const newCar = await prisma.car.create({
        data: createData,
    });
    return {
        ...newCar,
        features: newCar.features as CarFeatures,
    };
};



export const uploadCarImageService = async (
    carId: bigint,
    url: string,
    thumbnail_url?: string
) => {
    if (!carId) {
        throw new AppError("Car ID is required to upload an image", 400);
    }
    if (!url) {
        throw new AppError("Image data is required", 400);
    }
    //save the image record in the database
    let uploadedUrl;
    if(thumbnail_url){
         uploadedUrl = await prisma.carImage.create({
        data: {
            car_id: carId!,
            url: url!, // Assuming the URL is passed directly
            thumbnail_url: thumbnail_url!, // Assuming the thumbnail URL is passed directly
        },
    });
    }
    else{
        uploadedUrl = await prisma.carImage.create({
        data: {
            car_id: carId!,
            url: url!, // Assuming the URL is passed directly
        },
    });
    }
   
    return uploadedUrl;
}


export const getAllCarsService = async (limit: number): Promise<CarResponse[]> => {// Default to 20 if not set in environment variables
    const cars = await prisma.car.findMany({
        include: {
            car_image: true,
        },
        take: limit, // Limit the number of cars returned
    });
    if(cars.length === 0){
        throw new AppError("No cars found", 404);
    }
    return cars.map(car => ({
        ...car,
        features: car.features as CarFeatures,
    }));
};




