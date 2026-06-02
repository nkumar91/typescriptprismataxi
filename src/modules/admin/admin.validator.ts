import { param, query, ValidationChain } from "express-validator";

export const QueryParamValidator:ValidationChain[] = [
    query("page").optional().isInt({min:1}).withMessage("page is must be an integer"),
    query("limit").optional().isInt({min:5}).withMessage("Limit is must be an integer"),
]
export const ParamsValidator:ValidationChain[] = [
    param("id").isInt({min:1}).withMessage("Id is must be an integer"),
]