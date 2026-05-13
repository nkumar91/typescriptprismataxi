import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/error.js";
export const getProfile = async (uuid) => {
    if (!uuid) {
        throw new Error("UUID is required");
    }
    // Simulate a database lookup
    const user = await prisma.user.findUnique({
        where: { uuid },
        select: {
            uuid: true,
            name: true,
            email: true,
            mobile: true,
            avatar: true,
            status: true,
            kyc_status: true,
            email_verified_at: true,
            mobile_verified_at: true,
            created_at: true,
            updated_at: true,
            deleted_at: false,
        }
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
export const submitKYCData = async (userId, { type, doc_number }, front_url, back_url) => {
    if (!userId || !type || !front_url) {
        throw new AppError("User ID, document type, and both images are required");
    }
    if (!doc_number) {
        throw new AppError("Document number is required");
    }
    let kycRecord;
    if (back_url) {
        kycRecord = await prisma.kycDocument.create({
            data: {
                user_id: userId,
                type: type,
                doc_number,
                front_url,
                back_url: back_url
            }
        });
    }
    else {
        // Simulate saving KYC data to the database
        kycRecord = await prisma.kycDocument.create({
            data: {
                user_id: userId,
                type: type,
                doc_number,
                front_url,
            }
        });
    }
    return kycRecord;
};
