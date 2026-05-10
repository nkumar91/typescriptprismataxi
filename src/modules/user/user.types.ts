//import { prisma } from "../../config/db.js";
//import type { User as PrismaUser } from "../../generated/prisma/client.js";
// export type User = PrismaUser;
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
