import { CreateUserInput, LoginInput } from "./auth.type.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import { env } from "../../config/env.js";
import { randomUUID } from "crypto";
import { AppError } from "../../utils/error.js";
import { generateToken, signJwt } from "../../utils/jwt.js";


const JWT_SECRET = env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;

export const registerUser = async (data: CreateUserInput) => {
// Check if email or mobile already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { mobile: data.mobile },
      ],
    },
  });
  if (existingUser) {
    throw new AppError("User with the same email or mobile already exists", 400);
  }
  // Hash password if provided
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }
  // Generate UUID for the new user
  const uuid = randomUUID();
  if(!uuid) {
    throw new AppError("Failed to generate UUID", 500);
  }
  data.uuid = uuid;
  // Create the user in the database
  return prisma.user.create({
    data: {
      ...data,
      status: "active", // Set default status to active, you can change this as per your requirements
      kyc_status: "not_submitted",
    },
  });
};




export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email,deleted_at:null },
  });
  if (!user || !user.password) {
    throw new AppError("Invalid email or account has been deleted", 401);
  }
  // if(user.status !== "active") {
  //   throw new AppError("User account is not active verification required", 403);
  // }
  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) {
    throw new AppError("Invalid password", 401);
  }

 
  // Generate JWT token
  const token = signJwt({
    userId: user.id,
    uuid: user.uuid,
    email: user.email,
    type: "user_auth",
  });
  const access_token = signJwt({
    userId: user.id,
    uuid: user.uuid,
    email: user.email,
    type: "access_token",
  },"30m");
  return { user, token, access_token };
};


// export const logoutUser = async (token: string) => {
//   // Invalidate the token by adding it to a blacklist in Redis
//   await redisClient.set(`blacklist:${token}`, "true", "EX", 60 * 60); // Set expiration to 1 hour
//   return true;
// };

export const verifyEmail = async (token: string) => {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded.email || !decoded.uuid) {
      throw new AppError("Invalid verification token", 400);
    }
    return prisma.user.update({
      where: { uuid: decoded.uuid},
      data: {
        email_verified_at: new Date(),
        status: "active",
      },
    });
  } catch (error:unknown) {
    throw new AppError("Invalid verification token", 400);
  }
};

export const verifyMobile = async (mobile: string, _otp: string) => {
  // In a real application, you'd verify the OTP against a stored value
  // For now, we'll just mark the mobile as verified
  // You should implement proper OTP verification logic

  return prisma.user.update({
    where: { mobile },
    data: {
      mobile_verified_at: new Date(),
    },
  });
};

export const generateEmailVerificationToken = (uuid: string, email: string) => {
  return generateToken(
    {
      uuid: uuid,
      email,
      type: "email_verification",
    },
    "24h"
  );
};

export const generatePasswordResetToken = (uuid: string, email: string) => {
  return jwt.sign(
    {
      uuid: uuid,
      email,
      type: "password_reset",
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};


export const sendVerificationEmail = async (email: string, token: string) => {
  // Implement your email sending logic here using nodemailer or any email service
  // For example:
  // const transporter = nodemailer.createTransport({
  //   host: env.EMAIL_HOST,
  //   port: env.EMAIL_PORT,
  //   auth: {
  //     user: env.EMAIL_USER,
  //     pass: env.EMAIL_PASS,
  //   },
  // });
  // const verificationLink = `${env.FRONTEND_URL}/verify-email?token=${token}`;
  // await transporter.sendMail({
  //   from: env.EMAIL_FROM,
  //   to: email,
  //   subject: "Email Verification",
  //   text: `Please verify your email by clicking the following link: ${verificationLink}`,
  // });
};


export const resetPassword = async (uuid: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  if(!hashedPassword) {
    throw new AppError("Failed to hash password", 500);
  }
  return prisma.user.update({ 
    where: { uuid },
    data: { password: hashedPassword },
  });
};