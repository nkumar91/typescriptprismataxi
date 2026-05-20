import { body, param, ValidationChain,query } from "express-validator";

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
	body("code").exists().isString().isLength({ max: 20 }).withMessage("Code must be a string up to 20 chars"),
	body("booking_amount").exists().isDecimal().withMessage("Booking amount must be a decimal number"),
];

export const couponUsageIdParamValidation: ValidationChain[] = [
	param("id").exists().isInt().withMessage("ID must be an integer"),
];

export const pageQueryValidation: ValidationChain[] = [
	query("page").optional().exists().isInt({min:1}).withMessage("Page must be an integer"),
	query("limit").optional().exists().isInt({min:50}).withMessage("Limit must be an integer"),
];

export const priceRequestValidation: ValidationChain[] = [
	body("car_id").exists().isInt().withMessage("car_id must be an integer"),
	body("start_date").exists().isISO8601().withMessage("start_date must be a valid ISO8601 date"),
	body("end_date").exists().isISO8601().withMessage("end_date must be a valid ISO8601 date").custom((end, { req }) => {
		const start = req.body.start_date;
		if (!start) return false;
		return new Date(end) > new Date(start);
	}).withMessage("end_date must be after start_date"),
	body("coupon_code").optional({ nullable: true }).isString().isLength({ max: 50 }).withMessage("coupon_code must be a string up to 50 chars"),
];

