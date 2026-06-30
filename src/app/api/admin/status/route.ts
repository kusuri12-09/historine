import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isAdminApiEnabled } from "@/lib/admin-config";
import type { AdminStatusResponse } from "@/types/api/admin/status";

export async function GET() {
  if (!isAdminApiEnabled()) {
    return NextResponse.json<AdminStatusResponse>(
      { success: false, data: null, error: "관리자 API가 비활성화되어 있습니다." },
      { status: 404 }
    );
  }

  const authenticated = await isAdminAuthenticated();

  return NextResponse.json<AdminStatusResponse>({
    success: true,
    data: { authenticated },
    error: null
  });
}
