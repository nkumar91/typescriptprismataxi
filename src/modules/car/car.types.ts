import { Prisma } from "../../generated/prisma/client.js";

export type CarFeatures = {
    ac?: boolean;
    gps?: boolean;
    bluetooth?: boolean;
    airbags?: number;
    sunroof?: boolean;
} | null;

export type CarStatus = "available" | "booked" | "maintenance" | "inactive";
export type FuelType = "petrol" | "diesel" | "electric" | "cng" | "hybrid";
export type TransmissionType = "manual" | "automatic";

export type CreateCarInput = {
    uuid: string;
    vendor_id: bigint;
    city_id: bigint;
    location_id?: bigint | null;
    name: string;
    brand: string;
    model: string;
    year: number;
    fuel_type?: FuelType;
    transmission?: TransmissionType;
    seats?: number;
    price_per_day: Prisma.Decimal;
    security_deposit: Prisma.Decimal;
    status?: CarStatus;
    features?: CarFeatures;
    description?: string | null;
    mileage?: Prisma.Decimal | null;
    is_featured?: boolean;
};

export type uploadCarImageInput = {
    car_id: bigint;
    url: Express.Multer.File;
    thumbnail_url?: string;
    is_primary?: boolean;
    sort_order?: number;
};

export type CarImageResponse = {
    id: bigint;
    car_id: bigint;
    url: string;
    thumbnail_url?: string | null;
    is_primary: boolean;
    sort_order: number;
    created_at: Date | null;
};

export type CarResponse = {
    id: bigint;
    uuid: string;
    vendor_id: bigint;
    city_id: bigint;
    location_id?: bigint | null;
    name: string;
    brand: string;
    model: string;
    year: number;
    fuel_type: FuelType;
    transmission: TransmissionType;
    seats: number;
    price_per_day: Prisma.Decimal;
    security_deposit: Prisma.Decimal;
    status: CarStatus;
    features?: CarFeatures;
    description?: string | null;
    mileage?: Prisma.Decimal | null;
    is_featured: boolean;
    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
    car_image?: CarImageResponse[];
};


export type paramsType = {
    id?: bigint;
    imgId?: bigint;
    cityId?: bigint;
};