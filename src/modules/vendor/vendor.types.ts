import { Prisma } from "../../generated/prisma/client.js";
export type BankAccountDetails = {
    account_no?: string;
    ifsc_code?: string;
    bank_address?: string;
    account_holder_name?: string;
} | null;
export type VendorStatus = "pending" | "approved" | "rejected" | "suspended";
export type createVendorInput = {
    user_id:bigint;
    business_name:string;
    gst_number?:string | null;
    pan_number?:string | null;
    status?:VendorStatus;
    approved_by?:bigint | null;
    approved_at?:Date | null;
    commission_rate?:Prisma.Decimal;
    bank_account?:BankAccountDetails;
    created_at:Date | null;
    updated_at:Date | null;
    deleted_at:Date | null;
}


export type VendorResponse = {
    id:bigint;
    user_id:bigint;
    business_name:string;
    gst_number?:string | null;
    pan_number?:string | null;
    status:VendorStatus;
    approved_by?:bigint | null;
    approved_at?:Date | null;
    commission_rate?:Prisma.Decimal;
    bank_account?:BankAccountDetails;
    created_at:Date | string | null;
    updated_at:Date | string | null;
    deleted_at:Date | string | null;

}

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


export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";
export type UserDetails={
    id:bigint,
    name:string,
    avatar?:string
}
export type BookingResponse = {
    id: bigint;
    booking_number: string;
    user_id: bigint;
    car_id: bigint;
    pickup_location_id: bigint;
    drop_location_id: bigint;
    start_date: Date;
    end_date: Date;
    total_days: number;
    base_amount: Prisma.Decimal;
    discount_amount?: Prisma.Decimal | null;
    surge_amount?: Prisma.Decimal | null;
    tax_amount: Prisma.Decimal;
    total_amount: Prisma.Decimal;
    security_deposit?: Prisma.Decimal | null;
    coupon_id?: bigint | null;
    status: BookingStatus;
    cancellation_reason?: string | null;
    cancelled_at?: Date | null;
    notes?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    user_deatils?:UserDetails[]

};


export type VendorRevenueResponse = {
    currency?:string;
    grossRevenue?: number;
    platformCommission?: number;
    vendorRevenue?: number;
    totalBookings?: number;
    platformRevenue?:number;
};