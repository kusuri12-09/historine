import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/admin-auth";
import { isAdminApiEnabled } from "@/lib/admin-config";
import { validateCsrfToken } from "@/lib/csrf";
import type { AdminLogoutResponse } from "@/types/api/auth/logout";

export async function POST(request: Request) {
  if (!isAdminApiEnabled()) {
    return NextResponse.json<AdminLogoutResponse>(
      { success: false, data: null, error: "관리자 API가 비활성화되어 있습니다." },
      { status: 404 }
    );
  }

  if (!(await validateCsrfToken(request))) {
    return NextResponse.json<AdminLogoutResponse>(
      { success: false, data: null, error: "요청 검증에 실패했습니다." },
      { status: 403 }
    );
  }

  await clearAdminSession();

  return NextResponse.json<AdminLogoutResponse>({
    success: true,
    data: { message: "로그아웃되었습니다." },
    error: null
  });
}
