import {Router} from "express";
import { requireAdminAuth } from "../../middleware/admin.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { cityIdParamValidation, createCityValidation, createLocationValidation } from "./cities.validator.js";
import * as CityController   from "./cities.controller.js";
import { createLimiter } from "../../middleware/ratelimit.middleware.js";
const citiesRouter = Router();
citiesRouter.get(
    "/",
    createLimiter(1,120),
    requireAuth
);
citiesRouter.get(
    "/:id/locations",
    createLimiter(1,120),
    requireAuth
);
citiesRouter.post(
    "/",
    createLimiter(1,10),
    requireAdminAuth,
    createCityValidation,
    CityController.createCityController
);
citiesRouter.post(
    "/:id/locations",
    createLimiter(1,10),
    requireAdminAuth,
    cityIdParamValidation,
    createLocationValidation,
    CityController.createLocationController
);
export default citiesRouter