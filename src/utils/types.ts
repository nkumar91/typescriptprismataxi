export type ApiResponse<T = unknown> = {
  status: string;
  message: string;
  total_page?:number;
  current_page?:number;
  page_size?:number;
  access_token?: null | string;
  refresh_token?: null | string;
  data?: T;
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