import { getProfile, submitKYCData } from "./user.service.js";
import { validationResult } from "express-validator";
import { AppError } from "../../utils/error.js";
import { uploadToCloudinary } from "../../utils/utils.js";
export const getUserProfile = async (req, res, next) => {
    try {
        const { uuid } = req.user;
        const userProfile = await getProfile(uuid);
        if (!userProfile) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        //  const {id, password, remember_token, deleted_at, ...userResponse } = userProfile;
        const responseData = {
            status: "success",
            message: "User profile",
            data: userProfile
        };
        res.json(responseData);
    }
    catch (error) {
        next(error);
    }
};
export const submitKYC = async (req, res, next) => {
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
        const files = req.files;
        const front = files?.front_image?.[0];
        const back = files?.back_image?.[0] || null;
        if (!front) {
            throw new AppError("Front image is required");
        }
        // Implement KYC submission logic here
        const { userId } = req.user;
        if (!userId) {
            throw new Error("User ID is required");
        }
        const [front_url, back_url] = await Promise.all([
            uploadToCloudinary(front.buffer, "upload/users"),
            back ? uploadToCloudinary(back.buffer, "upload/users") : Promise.resolve(null),
        ]);
        const kycData = req.body;
        const kycRecord = await submitKYCData(userId, kycData, front_url, back_url);
        res.json({
            status: "success",
            message: "KYC submitted successfully",
            data: kycRecord
        });
    }
    catch (error) {
        next(error);
    }
};
