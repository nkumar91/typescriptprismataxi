export type ApiResponse<T = unknown> = {
  status: string;
  message: string;
  access_token?: null | string;
  refresh_token?: null | string;
  data?: T;
};

export interface TokenPayload {
    userId?: bigint;
    uuid: string;
    email: string;
    type?: string;
}