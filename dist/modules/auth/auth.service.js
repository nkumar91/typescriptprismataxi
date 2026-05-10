import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import { env } from "../../config/env.js";
// import crypto from "crypto"; // Commented out as it's not used yet
const JWT_SECRET = env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;
export const registerUser = async (data) => {
    // Hash password if provided
    if (data.password) {
        data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    return prisma.user.create({
        data: {
            ...data,
            status: "pending",
            kyc_status: "not_submitted",
        },
    });
};
export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user || !user.password) {
        return null;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return null;
    }
    // Generate JWT token
    const token = jwt.sign({
        userId: user.id,
        uuid: user.uuid,
        email: user.email,
    }, JWT_SECRET, { expiresIn: "7d" });
    return { user, token };
};
export const verifyEmail = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.email || !decoded.userId) {
            return null;
        }
        return prisma.user.update({
            where: { id: BigInt(decoded.userId) },
            data: {
                email_verified_at: new Date(),
                status: "active",
            },
        });
    }
    catch (_error) {
        return null;
    }
};
export const verifyMobile = async (mobile, _otp) => {
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
export const generateEmailVerificationToken = (userId, email) => {
    return jwt.sign({
        userId: userId.toString(),
        email,
        type: "email_verification",
    }, JWT_SECRET, { expiresIn: "24h" });
};
export const generatePasswordResetToken = (userId, email) => {
    return jwt.sign({
        userId: userId.toString(),
        email,
        type: "password_reset",
    }, JWT_SECRET, { expiresIn: "1h" });
};
