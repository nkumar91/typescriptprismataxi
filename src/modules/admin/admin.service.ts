import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/error.js";

export const getUsersHistoryService = async (
    page: number,
    limit: number
) => {
    page = Number(page) || 1;
    limit = Number(limit) || 20;
    const skip = (page - 1) * limit;
    const [users, totalUsers] = await Promise.all([prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
            created_at: "desc",
        },
        omit: {
            password: true,
        },
    }),
    prisma.user.count(),
    ]);
    const totalPages = Math.ceil(totalUsers / limit);
    return {
        totalPages,
        totalUsers: totalUsers,
        page,
        users,
        limit
    }
}



export const getUserHistoryService = async (
    userId: bigint
) => {
    if (!userId) {
        throw new AppError("User id is required", 400);
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            kyc_documents: true,
            // bookings: {
            //     include: {
            //         car: true,
            //         pickup_location: true,
            //         drop_location: true,
            //     },
            //     orderBy: {
            //         created_at: "desc",
            //     },
            // },
        },
        omit: {
            password: true,
        },
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
}


export const updateUserHistoryService = async (
    userId: bigint
) => {
    if (!userId) {
        throw new AppError("User id is required", 400);
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: newStatus,
        },
    });

    return updatedUser;
}


export const getAllKycPendingService = async (
    page: number,
    limit: number
) => {
    page = Number(page) || 1;
    limit = Number(limit) || 20;
    const skip = (page - 1) * limit;
    const [kyc, totalKyc] = await Promise.all([prisma.kycDocument.findMany({
        where: { status: "pending" },
        skip,
        take: limit,
        orderBy: {
            created_at: "desc",
        },
    }),
    prisma.kycDocument.count(),
    ]);
    const totalPages = Math.ceil(totalKyc / limit);
    return {
        totalPages,
        totalPendingKyc: totalKyc,
        page,
        kyc,
        limit
    }
}


export const approveKycService = async (
    kycId: bigint
) => {
    if (!kycId) {
        throw new AppError("Kyc id is required", 400);
    }
    const kyc = await prisma.kycDocument.findUnique({
        where: {
            id: kycId,
        },
    });
    if (!kyc) {
        throw new AppError("Kyc not found", 404);
    }
    if (kyc.status === "approved") {
        throw new AppError("KYC is already approved", 400);
    }
    // const newStatus = user.status === "suspended" ? "active": "suspended";
    const updatedKyc = await prisma.kycDocument.update({
        where: {
            id: kycId,
        },
        data: {
            status: "approved",
            reviewed_at: new Date(),
            reviewed_by: 1
        },
    });

    return updatedKyc;
}



export const rejectKycService = async (
    kycId: bigint
) => {
    if (!kycId) {
        throw new AppError("Kyc id is required", 400);
    }
    const kyc = await prisma.kycDocument.findUnique({
        where: {
            id: kycId,
        },
    });
    if (!kyc) {
        throw new AppError("Kyc not found", 404);
    }
    // const newStatus = user.status === "suspended" ? "active": "suspended";
    const updatedKyc = await prisma.kycDocument.update({
        where: {
            id: kycId,
        },
        data: {
            status: "rejected",
        },
    });

    return updatedKyc;
}

export const getAllBookingsService = async (
    page: number,
    limit: number
) => {
    page = Number(page) || 1;
    limit = Number(limit) || 20;
    const skip = (page - 1) * limit;
    const [bookings, totalBookings] = await Promise.all([prisma.booking.findMany({
        skip,
        take: limit,
        orderBy: {
            created_at: "desc",
        },
        include: {
            car: {
                include: {
                    car_image: true
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
    }),
    prisma.booking.count(),
    ]);
    const totalPages = Math.ceil(totalBookings / limit);
    return {
        totalPages,
        totalBookings,
        page,
        bookings,
        limit
    }
}
