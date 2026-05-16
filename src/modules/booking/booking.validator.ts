import { body, param, ValidationChain } from "express-validator";

export const createBookingValidation: ValidationChain[] = [
	// body("booking_number").isString().withMessage("Booking number must be a string"),
	body("car_id").isInt().withMessage("Car ID must be an integer"),
	body("pickup_location_id").isInt().withMessage("Pickup location ID must be an integer"),
	body("drop_location_id").isInt().withMessage("Drop location ID must be an integer"),
	body("start_date").isISO8601().withMessage("Start date must be a valid date"),
	body("end_date").isISO8601().withMessage("End date must be a valid date"),
	body("total_days").isInt({ min: 1 }).withMessage("Total days must be a positive integer"),
	body("base_amount").isDecimal().withMessage("Base amount must be a decimal number"),
	body("discount_amount").optional({ nullable: true }).isDecimal().withMessage("Discount amount must be a decimal number"),
	body("surge_amount").optional({ nullable: true }).isDecimal().withMessage("Surge amount must be a decimal number"),
	body("tax_amount").isDecimal().withMessage("Tax amount must be a decimal number"),
	body("total_amount").isDecimal().withMessage("Total amount must be a decimal number"),
	body("security_deposit").optional({ nullable: true }).isDecimal().withMessage("Security deposit must be a decimal number"),
	body("coupon_id").optional({ nullable: true }).isInt().withMessage("Coupon ID must be an integer"),
	body("status").optional().isIn(["pending", "confirmed", "active", "completed", "cancelled"]).withMessage("Status must be one of: pending, confirmed, active, completed, cancelled"),
	body("cancellation_reason").optional({ nullable: true }).isString().withMessage("Cancellation reason must be a string"),
	body("cancelled_at").optional({ nullable: true }).isISO8601().withMessage("Cancelled at must be a valid date"),
	body("notes").optional({ nullable: true }).isString().withMessage("Notes must be a string"),
];

export const updateBookingValidation: ValidationChain[] = [
	body("start_date").optional().isISO8601().withMessage("Start date must be a valid date"),
	body("end_date").optional().isISO8601().withMessage("End date must be a valid date"),
	body("total_days").optional().isInt({ min: 1 }).withMessage("Total days must be a positive integer"),
	body("base_amount").optional().isDecimal().withMessage("Base amount must be a decimal number"),
	body("discount_amount").optional({ nullable: true }).isDecimal().withMessage("Discount amount must be a decimal number"),
	body("surge_amount").optional({ nullable: true }).isDecimal().withMessage("Surge amount must be a decimal number"),
	body("tax_amount").optional().isDecimal().withMessage("Tax amount must be a decimal number"),
	body("total_amount").optional().isDecimal().withMessage("Total amount must be a decimal number"),
	body("security_deposit").optional({ nullable: true }).isDecimal().withMessage("Security deposit must be a decimal number"),
	body("coupon_id").optional({ nullable: true }).isInt().withMessage("Coupon ID must be an integer"),
	body("status").optional().isIn(["pending", "confirmed", "active", "completed", "cancelled"]).withMessage("Status must be one of: pending, confirmed, active, completed, cancelled"),
	body("cancellation_reason").optional({ nullable: true }).isString().withMessage("Cancellation reason must be a string"),
	body("cancelled_at").optional({ nullable: true }).isISO8601().withMessage("Cancelled at must be a valid date"),
	body("notes").optional({ nullable: true }).isString().withMessage("Notes must be a string"),
];


export const paramsValidation:ValidationChain[] = [
    param("id").isInt().withMessage("Booking id must be an integer"),
]


export const cancelValidation:ValidationChain[] = [
    param("id").isInt().withMessage("Booking id must be an integer"),
    body("cancellation_reason").isString().withMessage("Cancellation reason must be a string")
]