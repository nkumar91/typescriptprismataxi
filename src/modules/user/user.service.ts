import {prisma} from "../../config/db.js"
import { AppError } from "../../utils/error.js";
import { BookingResponse, KYCDocumentType, KyCSubmission } from "./user.types.js";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
export const getProfile = async (uuid: string) => {
    if (!uuid) {
        throw new Error("UUID is required");
    }
    // Simulate a database lookup
    const user = await prisma.user.findUnique({
        where: { uuid },
        select:{
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
}


export const getKycDetails = async (user_id: bigint) => {
    if (!user_id) {
        throw new Error("User ID is required");
    }
    // Simulate a database lookup
    const kycDocument = await prisma.kycDocument.findFirst({
        where: { user_id }
    });
    if (!kycDocument) {
        throw new Error("KYC document not found");
    }
    return kycDocument;
}



export const submitKYCData = async (
    userId: bigint,
    {type, doc_number}: KyCSubmission,
    front_url: string,
    back_url?: string
) => {
    if (!userId || !type || !front_url) {
        throw new AppError("User ID, document type, and both images are required");
    }
    if(!doc_number){
        throw new AppError("Document number is required");
    }

    let kycRecord;
    if(back_url){
         kycRecord = await prisma.kycDocument.create({
        data: {
            user_id: userId,
            type: type as KYCDocumentType,
            doc_number,
            front_url,
            back_url: back_url
        }
    });
    }
    else{
    // Simulate saving KYC data to the database
     kycRecord = await prisma.kycDocument.create({
        data: {
            user_id: userId,
            type: type as KYCDocumentType,
            doc_number,
            front_url,
        }
    });
    }
    const KYC_STATUS_PENDING = "pending";
    const kycStatus = await prisma.user.update({
        where: { id: userId },
        data: { kyc_status: KYC_STATUS_PENDING }
    });
    if(!kycStatus) {
        throw new AppError("Failed to update KYC status", 500);
    }
    return kycRecord;
}

export const updateProfile = async (uuid: string, name?: string, email?: string, mobile?: string) => {
  if (!uuid) {
    throw new AppError("User ID is required", 400);
  }
    const updateData: { name?: string; email?: string; mobile?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;
    if (Object.keys(updateData).length === 0) {
        throw new AppError("At least one field (name, email, or mobile) must be provided for update", 400);
    }
    const updatedUser = await prisma.user.update({
        where: { uuid },
        data: updateData,
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
        }
    });
    return updatedUser;
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


export const getAllBookingService = async(
userId:bigint
):Promise<BookingResponse[]>=>{
        const bookingData = await prisma.booking.findMany({
            where:{
                user_id:userId
            },include: {
            car: {
                include:{
                    car_image:true
                }
            },
            pickup_location: {
                include: {
                    city: true,
                },
            },
            drop_location: {
                include: {
                    city: true,
                },
            },
        }
        });
        if(!bookingData){
            throw new AppError("Booking Details not found",404);
        }
        return bookingData!
        
}