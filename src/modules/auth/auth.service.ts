import { CreateUserInput, LoginInput } from "./auth.type.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import { env } from "../../config/env.js";
import { randomUUID } from "crypto";
import { AppError } from "../../utils/error.js";
import { signJwt } from "../../utils/jwt.js";
import redisClient from "../../config/redis.js";

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

  const uuid = randomUUID();
  if(!uuid) {
    throw new AppError("Failed to generate UUID", 500);
  }
  data.uuid = uuid;
  return prisma.user.create({
    data: {
      ...data,
      status: "pending",
      kyc_status: "not_submitted",
    },
  });
};




export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate JWT token
  const token = signJwt({
    uuid: user.uuid,
    email: user.email,
  });

  return { user, token };
};


// export const logoutUser = async (token: string) => {
//   // Invalidate the token by adding it to a blacklist in Redis
//   await redisClient.set(`blacklist:${token}`, "true", "EX", 60 * 60); // Set expiration to 1 hour

//   return true;
// };



export const verifyEmail = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
      userId?: string;
      email?: string;
    };

    if (!decoded.email || !decoded.userId) {
      throw new AppError("Invalid verification token", 400);
    }

    return prisma.user.update({
      where: { id: BigInt(decoded.userId) },
      data: {
        email_verified_at: new Date(),
        status: "active",
      },
    });
  } catch (_error) {
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

export const generateEmailVerificationToken = (userId: bigint, email: string) => {
  return jwt.sign(
    {
      userId: userId.toString(),
      email,
      type: "email_verification",
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export const generatePasswordResetToken = (userId: bigint, email: string) => {
  return jwt.sign(
    {
      userId: userId.toString(),
      email,
      type: "password_reset",
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};