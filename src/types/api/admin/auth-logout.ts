import type { ApiResponse } from "@/types/api/common";

export type AdminLogoutData = {
  message: string;
};

export type AdminLogoutResponse = ApiResponse<AdminLogoutData>;
