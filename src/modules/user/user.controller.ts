import { Response, NextFunction } from "express";
import { RequestWithUser } from "../../middleware/auth.middleware.js";
import { getProfile } from "./user.service.js";
import { GetProfileResponse, KyCSubmission } from "./user.types.js";
import { ApiResponse } from "../../utils/types.js";
import { validationResult } from "express-validator";


export const getUserProfile = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { uuid } = req.user!;
        const userProfile = await getProfile(uuid);
        if (!userProfile) {
            res.status(404).json({ message: "User not found" });
            return;
        }
      //  const {id, password, remember_token, deleted_at, ...userResponse } = userProfile;
        const responseData: ApiResponse<GetProfileResponse> = {
            status: "success",
            message: "User profile",
            data: userProfile
        };
        res.json(responseData);
    } catch (error) {
        next(error);
    }
};


export const submitKYC = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);
           if (!errors.isEmpty()) {
             const errorMessages = errors.array().map(err => err.msg);
              res.status(400).json({
               status: "failed",
               message: errorMessages
             });
             return;
           }

        // Implement KYC submission logic here
        const {userId, uuid } = req.user!;
        const kycData: KyCSubmission = req.body;
        res.json({ message: "KYC submitted successfully" });
    } catch (error) {
        next(error);
    }
};