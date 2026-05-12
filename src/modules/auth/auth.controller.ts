import { Request, Response, NextFunction } from "express";
import { CreateUserInput, LoginInput, UserResponse } from "./auth.type.js";
import { ApiResponse } from "../../utils/types.js";
import { 
  registerUser,
  loginUser,
  verifyEmail,
  verifyMobile, 
  // generateEmailVerificationToken, 
  // sendVerificationEmail, 
  resetPassword
} from "./auth.service.js";
import { validationResult } from "express-validator";
import { verifyJwt } from "../../utils/jwt.js";
import jwt from "jsonwebtoken";
import redisClient from "../../config/redis.js";
import { RequestWithUser } from "../../middleware/auth.middleware.js";

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

    //send mail with verification link here using user.email and generated token
    // const verificationToken = generateEmailVerificationToken(user.uuid, user.email);
    // if(!verificationToken) {
    //   console.error("Failed to generate verification token");
    // }
    // await sendVerificationEmail(user.email, verificationToken)
    // .catch(err => {
    //   console.error("Failed to send verification email", err);
    // });

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
    const { email, password }: LoginInput = req.body;
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

    const responseData: ApiResponse<UserResponse> = {
      status: "success",
      message: "Login successfully",
      data: userResponse,
      access_token: token
    };

    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
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

// Logout controller
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    // Verify token is valid
    const decoded = verifyJwt(token as any);
    if (!decoded) {
      return res.status(401).json({ status: 'failed', message: 'Invalid or expired token' });
    }
    // Decode token to get expiry
    const decodedPayload: any = jwt.decode(token as string);
    const exp = decodedPayload?.exp as number | undefined;
    if (!exp) {
      return res.status(400).json({ status: 'failed', message: 'Invalid token payload' });
    }

    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;
    if (ttl <= 0) {
      return res.status(400).json({ status: 'failed', message: 'Token already expired' });
    }

    // blacklist the token in Redis
    await redisClient.setEx(`bl:${token}`, ttl, '1');
    return res.status(200).json({ status: 'success', message: 'Logout successful' });
  } catch (err) {
    console.error('Logout Error', err);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
};


export const resetUserPassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { uuid } = req.user || {};
    if (!uuid) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized"
      });
    }
    const {new_password} = req.body;
    if (!new_password) {
      return res.status(400).json({
        status: "failed",
        message: "New password is required"
      });
    }
    const user = await resetPassword(uuid, new_password);
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid or expired password reset token"
      });
    }
    const responseData:ApiResponse<null> = {
      status: "success",
      message: "Password reset successfully"
    };
    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  } 
};
