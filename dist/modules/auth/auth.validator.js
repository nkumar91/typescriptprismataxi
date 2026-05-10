import { body } from "express-validator";
export const validateRegister = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
];
