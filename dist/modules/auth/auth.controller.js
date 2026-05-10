import { registerUser, loginUser, verifyEmail, verifyMobile } from "./auth.service.js";
export const register = async (req, res, next) => {
    try {
        const userData = req.body;
        // Validate required fields
        if (!userData.uuid || !userData.name || !userData.email || !userData.mobile) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: uuid, name, email, mobile"
            });
        }
        const user = await registerUser(userData);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User registration failed"
            });
        }
        // Return user data excluding sensitive information
        const { password: _password, remember_token: _token, ...userResponse } = user;
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userResponse
        });
    }
    catch (error) {
        // Handle unique constraint violations
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            const prismaError = error;
            const field = prismaError.meta?.target?.[0];
            return res.status(409).json({
                success: false,
                message: `${field} already exists`
            });
        }
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        const result = await loginUser(email, password);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const { user, token } = result;
        const { password: _password, remember_token: _rememberToken, ...userResponse } = user;
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: userResponse,
                token
            }
        });
    }
    catch (error) {
        next(error);
    }
};
export const verifyEmailController = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required"
            });
        }
        const user = await verifyEmail(token);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }
        const { password: _password, remember_token: _rememberToken, ...userResponse } = user;
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: userResponse
        });
    }
    catch (error) {
        next(error);
    }
};
export const verifyMobileController = async (req, res, next) => {
    try {
        const { mobile, otp } = req.body;
        if (!mobile || !otp) {
            return res.status(400).json({
                success: false,
                message: "Mobile number and OTP are required"
            });
        }
        const user = await verifyMobile(mobile, otp);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP or mobile number"
            });
        }
        const { password: _password, remember_token: _rememberToken, ...userResponse } = user;
        return res.status(200).json({
            success: true,
            message: "Mobile verified successfully",
            data: userResponse
        });
    }
    catch (error) {
        next(error);
    }
};
