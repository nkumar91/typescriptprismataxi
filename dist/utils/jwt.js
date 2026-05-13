import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
const JWT_EXPIRE = env.JWT_EXPIRE || '7d';
const getJwtSecret = () => env.JWT_SECRET || 't6d_6Gf^2**145@62$$&1kH@';
export const signJwt = (payload, expiresIn) => {
    try {
        const secret = getJwtSecret();
        return jwt.sign(payload, secret, { expiresIn: expiresIn || JWT_EXPIRE });
    }
    catch (err) {
        return null;
    }
};
export const generateToken = (payload, expiresIn) => {
    try {
        const secret = getJwtSecret();
        return jwt.sign(payload, secret, { expiresIn: expiresIn || JWT_EXPIRE });
    }
    catch (err) {
        return null;
    }
};
export const verifyJwt = (token) => {
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        return decoded;
    }
    catch (err) {
        console.error('JWT verification failed:', err);
        return null;
    }
};
