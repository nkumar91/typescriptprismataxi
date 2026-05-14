import express from 'express';
// import * as CarController  from './car.controller.js';
const carRouter = express.Router();

//Public routes
// carRouter.get('/', CarController.getAllCars);
// carRouter.get('/:id', CarController.getCarById);
// carRouter.get('/:id/availability', CarController.getCarAvailability);
// carRouter.get('/city/:cityId', CarController.getCarsByCity);


// Vendor/Admin routes (protected by authentication middleware)
// carRouter.post('/', CarController.createCar);
// carRouter.put('/:id', CarController.updateCar);

// Admin routes (protected by authentication and admin authorization middleware)
// carRouter.delete('/:id', CarController.deleteCar);


// Vendor/Admin routes (protected by authentication middleware)
// carRouter.post('/:id/images', CarController.uploadCarImage);
// carRouter.delete('/:id/images/:imgId', CarController.deleteCarImage);
// carRouter.patch('/:id/status', CarController.updateCarStatus);




export default carRouter;