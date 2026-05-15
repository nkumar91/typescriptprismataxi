import express from 'express';
import * as CarController  from './car.controller.js';
import { vendorAuth } from '../../middleware/vendor.middleware.js';
import { createLimiter } from '../../middleware/ratelimit.middleware.js';
import { cloud } from './car.middleware.js';
import { 
    carUpdateStatusValidation, 
    updateCarValidation, 
    validateCreateCarInput 
} from './car.validator.js';
import { requireAdminAuth } from '../../middleware/admin.middleware.js';
const carRouter = express.Router();

//Public routes
carRouter.get(
'/',
createLimiter(1,120),
CarController.getAllCars
);

carRouter.get(
'/:id', 
createLimiter(1,120),
CarController.getCarById
);

carRouter.get(
'/:id/availability', 
createLimiter(1,60),
CarController.getCarAvailability
);

carRouter.get(
'/city/:cityId', 
createLimiter(1,120),
CarController.getCarsByCity
);


// Vendor/Admin routes (protected by authentication middleware)
carRouter.post(
    '/',
    createLimiter(1, 30), // Limit to 30 requests per minute for car creation
    validateCreateCarInput, // Validation middleware for car creation input
    vendorAuth, 
    CarController.createCar
);
carRouter.put(
    '/:id', 
    createLimiter(1,30),
    updateCarValidation, // Validation middleware for car update input
    vendorAuth,
    CarController.updateCar
);

// Admin routes (protected by authentication and admin authorization middleware)
carRouter.delete(
'/:id', 
createLimiter(1,10),
requireAdminAuth,
CarController.deleteCar
);


// Vendor/Admin routes (protected by authentication middleware)
carRouter.post(
'/:id/images', 
createLimiter(1,10),
vendorAuth,
cloud.fields([
    { name: 'url', maxCount: 1 },
    { name: 'thumbnail_url', maxCount: 1 }
]),
CarController.uploadCarImage
);
carRouter.delete(
'/:id/images/:imgId', 
createLimiter(1,10),
vendorAuth,
CarController.deleteCarImage
);
carRouter.patch(
'/:id/status', 
createLimiter(1,30),
vendorAuth,
carUpdateStatusValidation,
CarController.updateCarStatus
);

export default carRouter;