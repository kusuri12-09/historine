import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/admin-auth";
import type { AdminLogoutResponse } from "@/types/api/auth/logout";

export async function POST() {
  await clearAdminSession();

  return NextResponse.json<AdminLogoutResponse>({
    success: true,
    data: { message: "로그아웃되었습니다." },
    error: null
  });
}
