import {Router} from "express";
import { requireAdminAuth } from "../../middleware/admin.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { cityIdParamValidation, createCityValidation, createLocationValidation } from "./cities.validator.js";
import * as CityController   from "./cities.controller.js";
import { createLimiter } from "../../middleware/ratelimit.middleware.js";
const citiesRouter = Router();

// Get all cities
citiesRouter.get(
    "/",
    createLimiter(1,120),
    requireAuth,
    CityController.getCitiesController
);
// Get all locations in a city
citiesRouter.get(
    "/:id/locations",
    createLimiter(1,120),
    cityIdParamValidation,
    requireAuth,
    CityController.getLocationController
);
// Create a new city
citiesRouter.post(
    "/",
    createLimiter(1,10),
    requireAdminAuth,
    createCityValidation,
    CityController.createCityController
);
// Create a new location in a city
citiesRouter.post(
    "/:id/locations",
    createLimiter(1,10),
    requireAdminAuth,
    cityIdParamValidation,
    createLocationValidation,
    CityController.createLocationController
);
export default citiesRouter