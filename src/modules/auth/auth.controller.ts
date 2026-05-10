import { Request, Response, NextFunction } from "express";
import { ApiResponse, CreateUserInput, LoginInput, UserResponse } from "./auth.type.js";
import { registerUser, loginUser, verifyEmail, verifyMobile } from "./auth.service.js";
import { validationResult } from "express-validator";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: CreateUserInput = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return res.status(400).json({
        status: "failed",
        message: errorMessages
      });
    }
    const user = await registerUser(userData);
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "User registration failed"
      });
    }

    // Return user data excluding sensitive information
    const { password: _password, remember_token: _token, ...userResponse } = user;
    const responseData: ApiResponse<UserResponse> = {
      status: "success",
      message: "User registered successfully",
      data: userResponse
    };
    return res.status(201).json(responseData);
  } catch (error: unknown) {
    // Handle unique constraint violations
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      const prismaError = error as { meta?: { target?: string[] } };
      const field = prismaError.meta?.target?.[0];
      return res.status(409).json({
        status: "failed",
        message: `${field} already exists`
      });
    }
    next(error);
  }
};





export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
   // check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return res.status(400).json({
        status: "failed",
        message: errorMessages
      });
    }
    // Extract email and password from request body
    const {email,password}: LoginInput = req.body;
    // Attempt to login user
    const result = await loginUser({ email, password });
    if (!result) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid credentials"
      });
    }

    const { user, token } = result;
    const { password: _password, remember_token: _rememberToken, ...userResponse } = user;

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    next(error);
  }
};

export const verifyMobileController = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    next(error);
  }
};