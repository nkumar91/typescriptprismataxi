import { body, ValidationChain } from "express-validator";

export const vendorInputValidation: ValidationChain[] = [
	body("business_name").exists().isString().withMessage("Business name must be a string"),
	body("gst_number").optional({ nullable: true }).isString().withMessage("GST number must be a string"),
	body("pan_number").optional({ nullable: true }).isString().withMessage("PAN number must be a string"),
	body("status").optional().exists().isIn(["pending", "approved", "rejected", "suspended"]).withMessage("Status must be one of: pending, approved, rejected, suspended"),
	body("approved_by").optional({ nullable: true }).isInt().withMessage("Approved by must be an integer"),
	body("approved_at").optional({ nullable: true }).isISO8601().withMessage("Approved at must be a valid date"),
	body("commission_rate").optional().isDecimal().withMessage("Commission rate must be a decimal number"),
	body("bank_account").optional({ nullable: true }).isObject().withMessage("Bank account must be an object"),
	body("bank_account.account_no").optional({ nullable: true }).isString().withMessage("Bank account number must be a string"),
	body("bank_account.ifsc_code").optional({ nullable: true }).isString().withMessage("IFSC code must be a string"),
	body("bank_account.bank_address").optional({ nullable: true }).isString().withMessage("Bank address must be a string"),
	body("bank_account.account_holder_name").optional({ nullable: true }).isString().withMessage("Account holder name must be a string"),
];