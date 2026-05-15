import { ValidationChain,body } from "express-validator";

export const validateCreateCarInput:ValidationChain[] = [
    // Add validation rules for each field in CreateCarInput
    // Example:
    body('name').isString().withMessage('Name must be a string'),
    body('brand').isString().withMessage('Brand must be a string'),
    body('city_id').isInt().withMessage('City ID must be an integer'),
    body('location_id').optional().isInt().withMessage('Location ID must be an integer'),
    body('model').isString().withMessage('Model must be a string'),
    body('year').isInt({ min: 1886 }).withMessage('Year must be a valid integer (after 1885)'),
    body('seats').isInt({ min: 1 }).withMessage('Seats must be a positive integer'),
    body('price_per_day').isFloat({ min: 0 }).withMessage('Price per day must be a non-negative number'),
    body('security_deposit').isFloat({ min: 0 }).withMessage('Security deposit must be a non-negative number'),
    body('status').isIn(['available', 'booked', 'maintenance', 'inactive']).withMessage('Status must be one of: available, booked, maintenance, inactive'),
    body('features').optional().isObject().withMessage('Features must be an object'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('mileage').optional().isFloat({ min: 0 }).withMessage('Mileage must be a non-negative number'),
    body('is_featured').optional().isBoolean().withMessage('Is featured must be a boolean'),
    body('transmission').isIn(['manual', 'automatic', 'semi-automatic']).withMessage('Transmission must be one of: manual, automatic, semi-automatic'),
    body('fuel_type').isIn(['petrol', 'diesel', 'electric', 'cng', 'hybrid']).withMessage('Fuel type must be one of: petrol, diesel, electric, cng, hybrid'),
       // Add more validation rules as needed
];


export const updateCarValidation: ValidationChain[] = [
    // Add validation rules for fields that can be updated
    // Example:
    body('name').optional().isString().withMessage('Name must be a string'),
    body('brand').optional().isString().withMessage('Brand must be a string'),
    body('model').optional().isString().withMessage('Model must be a string'),
    body('year').optional().isInt({ min: 1886 }).withMessage('Year must be a valid integer (after 1885)'),
    body('seats').optional().isInt({ min: 1 }).withMessage('Seats must be a positive integer'),
    body('price_per_day').optional().isFloat({ min: 0 }).withMessage('Price per day must be a non-negative number'),
    body('security_deposit').optional().isFloat({ min: 0 }).withMessage('Security deposit must be a non-negative number'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('mileage').optional().isFloat({ min: 0 }).withMessage('Mileage must be a non-negative number'),
    body('is_featured').optional().isBoolean().withMessage('Is featured must be a boolean'),
    body('transmission').optional().isIn(['manual', 'automatic', 'semi-automatic']).withMessage('Transmission must be one of: manual, automatic, semi-automatic'),
    body('fuel_type').optional().isIn(['petrol', 'diesel', 'electric', 'cng', 'hybrid']).withMessage('Fuel type must be one of: petrol, diesel, electric, cng, hybrid'),
    body('status').optional().isIn(['available', 'booked', 'maintenance', 'inactive']).withMessage('Status must be one of: available, booked, maintenance, inactive'),
    body('features').optional().isObject().withMessage('Features must be an object'),
    body('city_id').optional().isInt().withMessage('City ID must be an integer'),
    body('location_id').optional().isInt().withMessage('Location ID must be an integer'),
    // Add more validation rules as needed
];

export const carUpdateStatusValidation: ValidationChain[] = [
    body('status').isIn(['available', 'booked', 'maintenance', 'inactive']).withMessage('Status must be one of: available, booked, maintenance, inactive'),
];

