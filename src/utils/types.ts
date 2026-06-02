export type ApiResponse<T = unknown> = {
  status: string;
  message: string;
  total_page?:number;
  current_page?:number;
  page_size?:number;
  access_token?: null | string;
  refresh_token?: null | string;
  data?: T;
  pagination?:object |null;
  total_users?:number | null;
  total_items?:number | null
};

export interface TokenPayload {
    userId?: bigint;
    uuid?: string;
    email?: string;
    type?: string;
    vendorId?: bigint;
    iat?: number;
    exp?: number;
}