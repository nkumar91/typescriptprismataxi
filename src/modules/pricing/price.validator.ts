import { body, param, ValidationChain } from "express-validator";

export const couponInputValidation: ValidationChain[] = [
	body("code").exists().isString().isLength({ max: 20 }).withMessage("Code must be a string up to 20 chars"),
	body("type").optional().isIn(["flat", "percentage"]).withMessage("Type must be either 'flat' or 'percentage'"),
	body("value").exists().isDecimal().withMessage("Value must be a decimal number"),
	body("max_discount").optional().isDecimal().withMessage("Max discount must be a decimal number"),
	body("min_booking_amount").isDecimal().withMessage("Min booking amount must be a decimal number"),
	body("usage_limit").optional().isInt({ min: 0 }).withMessage("Usage limit must be a non-negative integer"),
	body("used_count").isInt({ min: 0 }).withMessage("Used count must be a non-negative integer"),
	body("user_limit").isInt({ min: 1 }).withMessage("User limit must be an integer >= 1"),
	body("valid_from").isISO8601().withMessage("valid_from must be a valid ISO8601 date"),
	body("valid_until").isISO8601().withMessage("valid_until must be a valid ISO8601 date"),
	body("is_active").optional().isBoolean().withMessage("is_active must be a boolean"),
];

export const couponIdParamValidation: ValidationChain[] = [
	param("id").exists().isInt().withMessage("ID must be an integer"),
];

export const couponUsageInputValidation: ValidationChain[] = [
	body("coupon_id").exists().isInt().withMessage("coupon_id must be an integer"),
	body("user_id").exists().isInt().withMessage("user_id must be an integer"),
	body("booking_id").exists().isInt().withMessage("booking_id must be an integer"),
	body("discount_applied").exists().isDecimal().withMessage("discount_applied must be a decimal number"),
];

export const couponUsageIdParamValidation: ValidationChain[] = [
	param("id").exists().isInt().withMessage("ID must be an integer"),
];

