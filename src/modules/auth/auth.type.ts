export type UserStatus = "active" | "suspended" | "pending";
export type KYCStatus = "pending" | "approved" | "rejected" | "not_submitted";

export type CreateUserInput = {
  uuid: string;
  name: string;
  email: string;
  mobile: string;
  password?: string;
  avatar?: string;
  remember_token?: string | null;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, "uuid">> & {
  mobile_verified_at?: string | Date | null;
  email_verified_at?: string | Date | null;
  status?: UserStatus;
  kyc_status?: KYCStatus;
  deleted_at?: string | Date | null;
};

export type UserFilter = {
  q?: string;
  status?: UserStatus;
  kyc_status?: KYCStatus;
  deleted?: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
};

// export type LoginResponse = {
//   user: Omit<User, "password" | "remember_token">;
//   token: string;
// };

export type EmailVerificationInput = {
  token: string;
};

export type MobileVerificationInput = {
  mobile: string;
  otp: string;
};

export type UserResponse = {
  id: bigint;
  uuid: string;
  name: string;
  email: string;
  mobile: string;
  avatar: string | null;
  email_verified_at: Date | null;
  mobile_verified_at: Date | null;
  status: UserStatus;
  kyc_status: KYCStatus;
  created_at: Date;
  updated_at: Date;
};

// export type ApiResponse<T = unknown> = {
//   status: string;
//   message: string;
//   token?: string;
//   data?: T;
// };