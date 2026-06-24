import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/admin-auth";
import { validateCsrfToken } from "@/lib/csrf";
import type { AdminLogoutResponse } from "@/types/api/auth/logout";

export async function POST(request: Request) {
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
