import { Request, Response, NextFunction } from 'express';
import { verifyJwt, TokenPayload } from '../utils/jwt.js';
import redisClient from '../config/redis.js';
import { AppError } from '../utils/error.js';

export interface RequestWithUser extends Request {
    user?: TokenPayload;
}

export const requireAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }
    const token:any = authHeader.split(' ')[1];
    try {
        // Check if token is blacklisted
        const blacklisted = await redisClient.get(`bl:${token}`);
        if (blacklisted) {
            return res.status(401).json({ status: 'failed', message: 'Token revoked' });
        }
        const decoded = verifyJwt<TokenPayload>(token);
        if (!decoded) {
            return res.status(401).json({ status: 'failed', message: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth middleware error', err);
        throw new AppError('Authentication failed', 401);
    }
};
