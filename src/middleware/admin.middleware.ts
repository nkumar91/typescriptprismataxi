import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.js';
import { TokenPayload } from '../utils/types.js';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';


const ADMIN_EMAIL = env.ADMIN_EMAIL! || null;
const ADMIN_PASSWORD = env.ADMIN_PASSWORD! || null;

export interface RequestWithAdmin extends Request {
    user?: TokenPayload;
}

export const requireAdminAuth = async (
    req: RequestWithAdmin,
    res: Response,
    next: NextFunction,
) => {

    try {
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.error('Admin credentials are not configured in env');
            throw new AppError('Admin authentication is not configured', 500);
        }
        const adminData = await prisma.admin.findUnique({
            where:{email:ADMIN_EMAIL}
        })

        if(!adminData){
          throw new AppError('Admin email is not correct !', 500);
        }

        if(adminData?.password !== ADMIN_PASSWORD){
            throw new AppError('Admin Password is not correct !', 500);
        }

        // const { vendor_id } = req.body! || undefined;
        if(req.body?.vendor_id){
            req.user! = {
                vendorId:req.body.vendor_id
            }
            return next();
        }
        return next();
    }

    catch (error) {
        // console.error('Admin auth middleware error', error);
        next(error)
    }
};
