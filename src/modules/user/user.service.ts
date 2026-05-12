import {prisma} from "../../config/db.js"
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