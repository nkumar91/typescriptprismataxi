import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { TokenPayload } from './types.js';



const JWT_EXPIRE = env.JWT_EXPIRE || '7d';
const getJwtSecret = ():string => env.JWT_SECRET || 't6d_6Gf^2**145@62$$&1kH@';



export const signJwt = (payload: TokenPayload, expiresIn?: string | number) => {
    try {
        const secret = getJwtSecret();
        return jwt.sign(payload, secret, { expiresIn: expiresIn || JWT_EXPIRE } as SignOptions);
    } catch (err) {
        return null;
    }
};

export const generateToken = (payload: TokenPayload, expiresIn?: string | number) => {
    try {
        const secret = getJwtSecret();
        return jwt.sign(payload, secret, { expiresIn: expiresIn || JWT_EXPIRE } as SignOptions);
    } catch (err) {
        return null;
    }
};

export const verifyJwt = <T = any>(token: string): T | null => {
    try {
        const decoded = jwt.verify(token, getJwtSecret()) as T;
        return decoded;
    } catch (err) {
        console.error('JWT verification failed:', err);
        return null;
    }
};
