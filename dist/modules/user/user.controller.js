import { getAllBookingService, getKycDetails, getProfile, resetPassword, submitKYCData, updateProfile } from "./user.service.js";
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
export const getUserBookings = async (req, res, next) => {
    try {
        const { userId } = req.user;
        // Implement logic to fetch user bookings here
        const bookings = await getAllBookingService(userId);
        const responseData = {
            status: "success",
            message: "User bookings retrieved successfully",
            data: bookings
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
export const changePassword = async (req, res, next) => {
    try {
        const { uuid } = req.user;
        const { new_password } = req.body;
        if (!new_password) {
            res.status(400).json({
                status: "failed",
                message: "New password is required"
            });
            return;
        }
        const user = await resetPassword(uuid, new_password);
        if (!user) {
            res.status(400).json({
                status: "failed",
                message: "Invalid or expired password reset token"
            });
            return;
        }
        const responseData = {
            status: "success",
            message: "Password reset successfully"
        };
        res.status(200).json(responseData);
    }
    catch (error) {
        next(error);
    }
};
export const getKYCStatus = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const kycDocument = await getKycDetails(userId);
        if (!kycDocument) {
            res.status(404).json({ message: "KYC document not found" });
            return;
        }
        const responseData = {
            status: "success",
            message: "KYC status retrieved successfully",
            data: kycDocument
        };
        res.json(responseData);
    }
    catch (error) {
        next(error);
    }
};
export const updateUserProfile = async (req, res, next) => {
    try {
        // Implement profile update logic here
        const { uuid } = req.user;
        const { name, email, mobile } = req.body;
        const updatedUser = await updateProfile(uuid, name, email, mobile);
        res.json({
            status: "success",
            message: "User profile updated successfully",
            data: updatedUser
        });
    }
    catch (error) {
        next(error);
    }
};
