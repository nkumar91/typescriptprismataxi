import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.js';
import redisClient from '../config/redis.js';
import { AppError } from '../utils/error.js';
import { TokenPayload } from '../utils/types.js';
import { prisma } from '../config/db.js';
import { env } from '../config/env.js';


const APPROVERD_STATUS = 'approved';
const ADMIN_EMAIL = env.ADMIN_EMAIL! || null;
const ADMIN_PASSWORD = env.ADMIN_PASSWORD! || null;
export interface RequestWithVendor extends Request {
    user?: TokenPayload;
}
export const vendorAuth = async (
    req: RequestWithVendor,
    res: Response, next:
        NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
         //Check Admin Auth
        const {admin_email,admin_password,vendor_id} = req.body!;
        if(ADMIN_EMAIL===admin_email && ADMIN_PASSWORD ===admin_password){
             req.user! = {vendorId:vendor_id}
             return next();
        }
        else{
         return res.status(401).json({
            status: 'failed',
            message: 'Unauthorized admin access'
        });
    }
    }
    const token: string = authHeader?.split(' ')[1] || '';
    try {
        // Verify token and extract payload
        const decoded = verifyJwt<TokenPayload>(token);
        if (!decoded) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid or expired token'
            });
        }
        // Check if token is blacklisted
        const blacklisted = await redisClient.get(`bl:${token}`);
        if (blacklisted) {
            return res.status(401).json({
                status: 'failed',
                message: 'Your token has been revoked'
            });
        }
        // Check if user has vendor role
        const { userId } = decoded;
        if (userId) {
            const checkVendorRole = await prisma.vendor.findUnique({
                where: { user_id: userId },
            });
            if (checkVendorRole?.status !== APPROVERD_STATUS) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'Forbidden: Insufficient permissions'
                });
            }
            // Ensure vendorId is included in the request object for downstream use
            decoded.vendorId = checkVendorRole?.id;
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error('vendor middleware error', err);
        throw new AppError('Authentication failed', 401);
    }
};
