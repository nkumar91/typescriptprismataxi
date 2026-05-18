import { prisma } from "../../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { CarUncheckedCreateInput } from "../../generated/prisma/models.js";
import { AppError } from "../../utils/error.js";
import {
    CarFeatures,
    CarResponse,
    CarStatus,
    CreateCarInput,
    UpdateCarInput
} from "./car.types.js";
import { randomUUID } from "crypto";


// createCarService: create a new car record for a given vendor
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

    const createData: CarUncheckedCreateInput = {
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

// uploadCarImageService: upload an image record for a specific car
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
    if (thumbnail_url) {
        uploadedUrl = await prisma.carImage.create({
            data: {
                car_id: carId!,
                url: url!,
                thumbnail_url: thumbnail_url!,
            },
        });
    }
    else {
        uploadedUrl = await prisma.carImage.create({
            data: {
                car_id: carId!,
                url: url!,
            },
        });
    }

    return uploadedUrl;
}


// getAllCarsService: retrieve a list of all non-deleted cars with a limit
export const getAllCarsService = async (limit: number, page: number) => {

    const whereCondition = {
        deleted_at: null,
    };
    // Find total count
    const totalCars = await prisma.car.count({
        where: whereCondition,
    });
    const cars = await prisma.car.findMany({
        where: {
            deleted_at: null, // Only include non-deleted cars
        },
        include: {
            car_image: true,
        },
        skip: (page - 1) * limit,
        take: limit, // Limit the number of cars returned
    });
    if (cars.length === 0) {
        throw new AppError("No cars found or all cars have been deleted", 404);
    }
    const totalPages = Math.ceil(totalCars / limit);
    return {
        totalPages,
        currentPage: page,
        page_size: limit,
        data: cars.map((car) => ({
            ...car,
            features: car.features as CarFeatures,
        })),
    };
};


// getCarByIdService: fetch a single car by its ID if it exists and is not deleted
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


// deleteCarService: mark a car as deleted by setting deleted_at timestamp
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

// deleteCarImageService: delete a car image record by image ID
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


// updateCarStatusService: update the availability status of a car
export const updateCarStatusService = async (carId: bigint, status: CarStatus): Promise<CarResponse> => {
    const car = await prisma.car.findUnique({
        where: { id: carId, deleted_at: null }, // Ensure we only update non-deleted cars
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


// getCarAvailabilityService: check if a specific car is available based on its status
export const getCarAvailabilityService = async (carId: bigint): Promise<{ available: boolean; status: CarStatus }> => {
    const car = await prisma.car.findFirst({
        where: { id: carId, deleted_at: null, status: "available" }, // Ensure we only check availability for non-deleted cars   
    });
    if (!car) {
        throw new AppError("Car is not found or has been deleted", 404);
    }
    const now = new Date();
    const checkAvailability = await prisma.booking.findFirst({
        where: {
            car_id: carId,
            start_date: {
                lte: now,
            },
            end_date: {
                gte: now
            }
        }
    });
    if (checkAvailability) {
        throw new AppError("Car is not available")
    }
    return {
        available: true,
        status: car.status,
    };
}

// getCarsByCityService: retrieve non-deleted cars available in a specific city
export const getCarsByCityService = async (cityId: bigint): Promise<CarResponse[]> => {
    const AVAILABLE = "available";
    const cars = await prisma.car.findMany({
        where: {
            city_id: cityId,
            status: AVAILABLE,
            deleted_at: null, // Only include non-deleted cars
        },
        include: {
            car_image: true,
        },
    });
    if (cars.length === 0) {
        throw new AppError("No cars found for the specified city or all cars in that city have been deleted", 404);
    }
    return cars.map(car => ({
        ...car,
        features: car.features as CarFeatures,
    }));
}



// updateCarService: update fields for an existing non-deleted car
export const updateCarService = async (carId: bigint, updateData: UpdateCarInput): Promise<CarResponse> => {
    const car = await prisma.car.findUnique({
        where: { id: carId, deleted_at: null }, // Ensure we only update non-deleted cars
    });
    if (!car) {
        throw new AppError("Car not found or has been deleted", 404);
    }
    const updatedCar = await prisma.car.update({
        where: { id: carId },
        data: {
            ...updateData,
            features: updateData.features !== undefined ? (updateData.features === null ? Prisma.JsonNull : updateData.features) : car.features!,
        },
    });
    return {
        ...updatedCar,
        features: updatedCar.features as CarFeatures,
    };
}





