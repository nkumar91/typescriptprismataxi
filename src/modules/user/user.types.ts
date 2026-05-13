export type UserStatus = "active" | "suspended" | "pending";
export type KYCStatus = "pending" | "approved" | "rejected" | "not_submitted";

export type GetProfileResponse = {
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










