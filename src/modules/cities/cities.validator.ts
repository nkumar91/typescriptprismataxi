import { body, param, ValidationChain } from "express-validator";

export const createCityValidation: ValidationChain[] = [
    body("name")
        .exists()
        .isString()
        .isLength({ max: 100 })
        .withMessage("name must be a string up to 100 chars"),
    body("state")
        .exists()
        .isString()
        .isLength({ max: 100 })
        .withMessage("state must be a string up to 100 chars"),
    body("country")
        .optional()
        .isString()
        .isLength({ min: 2, max: 2 })
        .withMessage("country must be a 2-letter string"),
    body("is_active")
        .optional()
        .isBoolean()
        .withMessage("is_active must be a boolean"),
];

export const updateCityValidation: ValidationChain[] = [
    body("name")
        .optional()
        .isString()
        .isLength({ max: 100 })
        .withMessage("name must be a string up to 100 chars"),
    body("state")
        .optional()
        .isString()
        .isLength({ max: 100 })
        .withMessage("state must be a string up to 100 chars"),
    body("country")
        .optional()
        .isString()
        .isLength({ min: 2, max: 2 })
        .withMessage("country must be a 2-letter string"),
    body("is_active")
        .optional()
        .isBoolean()
        .withMessage("is_active must be a boolean"),
];

export const cityIdParamValidation: ValidationChain[] = [
    param("id")
        .exists()
        .isInt()
        .withMessage("id must be an integer"),
];

export const createLocationValidation: ValidationChain[] = [
    body("name")
        .exists()
        .isString()
        .isLength({ max: 150 })
        .withMessage("name must be a string up to 150 chars"),
    body("address")
        .optional()
        .isString()
        .withMessage("address must be a string"),
    body("lat")
        .optional()
        .isDecimal()
        .withMessage("lat must be a decimal number"),
    body("lng")
        .optional()
        .isDecimal()
        .withMessage("lng must be a decimal number"),
    body("is_active")
        .optional()
        .isBoolean()
        .withMessage("is_active must be a boolean"),
];

export const updateLocationValidation: ValidationChain[] = [
    body("name")
        .optional()
        .isString()
        .isLength({ max: 150 })
        .withMessage("name must be a string up to 150 chars"),
    body("address")
        .optional()
        .isString()
        .withMessage("address must be a string"),
    body("lat")
        .optional()
        .isDecimal()
        .withMessage("lat must be a decimal number"),
    body("lng")
        .optional()
        .isDecimal()
        .withMessage("lng must be a decimal number"),
    body("is_active")
        .optional()
        .isBoolean()
        .withMessage("is_active must be a boolean"),
];
