import type { ApiResponse } from "@/types/api/common";

export type AdminLoginRequest = {
  username: string;
  password: string;
};

export type AdminLoginData = {
  message: string;
};

export type AdminLoginResponse = ApiResponse<AdminLoginData>;
