import { Prisma } from "../../generated/prisma/client.js";

export type QueryParams = {
    id?:bigint,
    page?: number,
    limit?: number,
}
export type UserStatus = "active" | "suspended" | "pending";
export type KYCStatus = "pending" | "approved" | "rejected" | "not_submitted";



export type GetUserResponse = {
    id: bigint,
    uuid: string;
    name: string;
    email: string;
    mobile: string;
    avatar?: string | null;
    status: UserStatus;
    kyc_status: KYCStatus;
    email_verified_at?: Date | null;
    mobile_verified_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
    remember_token:string | null;
    deleted_at?:Date | null;
};

export type KYCDocumentType = "aadhar" | "driving_license" | "passport";
export type KyCSubmission = {
  user_id?: bigint;
  type: KYCDocumentType;
  front_image: string;
  back_image?: string;
  doc_number: string;
};
export type KycStatusResponse = {
  id: bigint;
  user_id: bigint;
  type: KYCDocumentType;
  doc_number: string | null;
  front_url: string;
  back_url?: string | null;
  status: KYCStatus;
  reviewed_at?: Date | null;
  reviewed_by?: bigint | null;
  rejection_reason?: string | null;
  created_at?: Date;
  updated_at?: Date;

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