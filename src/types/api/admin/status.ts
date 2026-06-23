import type { ApiResponse } from "@/types/api/common";

export type AdminStatusData = {
  authenticated: boolean;
};

export type AdminStatusResponse = ApiResponse<AdminStatusData>;
