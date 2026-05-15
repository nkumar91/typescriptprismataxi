import express from 'express';
import * as CarController  from './car.controller.js';
import { vendorAuth } from '../../middleware/vendor.middleware.js';
import { createLimiter } from '../../middleware/ratelimit.middleware.js';
import { cloud } from './car.middleware.js';
import { validateCreateCarInput } from './car.validator.js';

const carRouter = express.Router();

//Public routes
carRouter.get(
'/',
CarController.getAllCars
);

// carRouter.get(
// '/:id', 
// CarController.getCarById
// );

// carRouter.get(
// '/:id/availability', 
// CarController.getCarAvailability
// );

// carRouter.get(
// '/city/:cityId', 
// CarController.getCarsByCity
// );


// Vendor/Admin routes (protected by authentication middleware)
carRouter.post(
    '/',
    createLimiter(1, 30), // Limit to 30 requests per minute for car creation
    validateCreateCarInput, // Validation middleware for car creation input
    vendorAuth, 
    CarController.createCar
);
// carRouter.put('/:id', CarController.updateCar);

// Admin routes (protected by authentication and admin authorization middleware)
// carRouter.delete(
// '/:id', 
// CarController.deleteCar
// );


// Vendor/Admin routes (protected by authentication middleware)
carRouter.post(
'/:id/images', 
createLimiter(1, 30),
vendorAuth,
cloud.fields([
    { name: 'url', maxCount: 1 },
    { name: 'thumbnail_url', maxCount: 1 }
]),
CarController.uploadCarImage
);

// carRouter.delete(
// '/:id/images/:imgId', 
// CarController.deleteCarImage
// );

// carRouter.patch(
// '/:id/status', 
// CarController.updateCarStatus
// );




export default carRouter;