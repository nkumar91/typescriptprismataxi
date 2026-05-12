import { body, ValidationChain } from "express-validator";

export const kycValidator:ValidationChain[] = [
    // Add validation rules for KYC submission here
    // Example: check if required fields are present and valid
    body("type").isString().withMessage("Document type is required and must be a string"),
    body("front_url").isString().withMessage("Front URL is required and must be a string"),
    body("back_url").optional().isString().withMessage("Back URL must be a string"),
    body("doc_number").optional().isString().withMessage("Document number must be a string"),
];