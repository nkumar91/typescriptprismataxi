import { body, ValidationChain } from "express-validator";

export const kycValidator:ValidationChain[] = [
    // Add validation rules for KYC submission here
    // Example: check if required fields are present and valid
    body("type").isString().withMessage("Document type is required and must be a string"),
    // body("front_image").isString().withMessage("Front image is required and must be a string"),
    // body("back_image").optional().isString().withMessage("Back image must be a string"),
    body("doc_number").optional().isString().withMessage("Document number must be a string"),
];