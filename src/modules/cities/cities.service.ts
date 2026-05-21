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
            id: cityId
        }
    });
    if (!city) {
        throw new AppError("City Does not  exists", 400)
    }
    locationInput.city_id = cityId;
    locationInput.created_at = new Date();
    locationInput.updated_at = new Date();
    return await prisma.location.create({
        data: {...locationInput},
    });
}


export const getAllCitieService = async (
    page: number,
    limit: number
):Promise<CityResponse[]> => {
    //  if (!page) {
    //     page = 1;
    // }
    // if (!limit) {
    //     limit = 50;
    // }
    // const skip = (page - 1) * limit;
    const city = await prisma.city.findMany();
    if (!city) {
        throw new AppError("City not found", 404)
    }
    return city
}



export const getLocationService = async(
    cityId:bigint
)=>{
        if(!cityId){
            throw new AppError("City ID is required", 400);
        }
        const location = await prisma.location.findMany({
            where:{
                city_id:cityId
            }
        });
        if(!location){
            throw new AppError("Location not found for the given city ID", 404);
        }
        return location;
}