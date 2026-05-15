
import { prisma } from "../../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { CarCreateInput } from "../../generated/prisma/models.js";
import { AppError } from "../../utils/error.js";
import { 
    CarFeatures, 
    CarResponse, 
    CarStatus, 
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
        where: {
            deleted_at: null, // Only include non-deleted cars
        },
        include: {
            car_image: true,
        },
        take: limit, // Limit the number of cars returned
    });
    if(cars.length === 0){
        throw new AppError("No cars found or all cars have been deleted", 404);
    }
    return cars.map(car => ({
        ...car,
        features: car.features as CarFeatures,
    }));
};


export const getCarByIdService = async (carId: bigint): Promise<CarResponse> => {
    const car = await prisma.car.findUnique({
        where: { id: carId, deleted_at: null }, // Ensure we only fetch non-deleted cars
        include: {
            car_image: true,
        },
    });
    if (!car) {
        throw new AppError("Car not found or has been deleted", 404);
    }
    return {
        ...car,
        features: car.features as CarFeatures,
    };
}


export const deleteCarService = async (carId: bigint): Promise<CarResponse> => {
    const car = await prisma.car.findUnique({
        where: { id: carId },
    });
    if (!car) {
        throw new AppError("Car not found", 404);
    }
    const deletedCar = await prisma.car.update({
        where: { id: carId },
        data: { deleted_at: new Date() },
    });
    return {
        ...deletedCar,
        features: deletedCar.features as CarFeatures,
    };;
}

export const deleteCarImageService = async (imgId: bigint) => {
    const carImage = await prisma.carImage.findUnique({
        where: { id: imgId },
    });
    if (!carImage) {
        throw new AppError("Car image not found", 404);
    }
    await prisma.carImage.delete({
        where: { id: imgId },
    });
}


export const updateCarStatusService = async (carId: bigint, status: CarStatus): Promise<CarResponse> => {
    const car = await prisma.car.findUnique({
        where: { id: carId ,deleted_at: null}, // Ensure we only update non-deleted cars
    });
    if (!car) {
        throw new AppError("Car is not found or has been deleted", 404);
    }
    const updatedCar = await prisma.car.update({
        where: { id: carId },
        data: { status },
    });
    return {
        ...updatedCar,
        features: updatedCar.features as CarFeatures,
    };
}


export const getCarAvailabilityService = async (carId: bigint): Promise<{ available: boolean; status: CarStatus }> => {
    const AVAILABLE_STATUSES: CarStatus[] = ["available"];
    const car = await prisma.car.findUnique({
        where: { id: carId, deleted_at: null }, // Ensure we only check availability for non-deleted cars   
    });
     if (!car) {
        throw new AppError("Car is not found or has been deleted", 404);
    }
    const isAvailable = AVAILABLE_STATUSES.includes(car.status);
    return {
        available: isAvailable,
        status: car.status,
    };
}





