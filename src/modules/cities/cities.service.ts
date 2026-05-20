import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/error.js";
import { CityResponse, CreateCityInput, CreateLocationInput, LocationResponse } from "./cities.types.js";

export const createCityService = async (
    cityInput: CreateCityInput
):Promise<CityResponse> => {
    const city = await prisma.city.findFirst({
        where: {
            name: cityInput.name
        }
    });
    if (city) {
        throw new AppError("City already exists", 400)
    }
    return await prisma.city.create({
        data: {...cityInput},
    });
}


export const createLocationService = async (
    locationInput: CreateLocationInput,
    cityId:bigint
):Promise<LocationResponse> => {
    const city = await prisma.city.findUnique({
        where: {
            id: locationInput.city_id
        }
    });
    if (!city) {
        throw new AppError("City Does not  exists", 400)
    }
    locationInput.city_id = cityId;
    return await prisma.location.create({
        data: {...locationInput},
    });
}