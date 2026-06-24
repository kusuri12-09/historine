import { NextResponse } from "next/server";
import { createAdminSession, validateAdminCredentials } from "@/lib/admin-auth";
import type { AdminLoginRequest, AdminLoginResponse } from "@/types/api/auth/login";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<AdminLoginRequest> | null;

  if (!body?.username || !body?.password) {
    return NextResponse.json<AdminLoginResponse>(
      { success: false, data: null, error: "로그인 정보를 확인해주세요." },
      { status: 400 }
    );
  }

  if (!validateAdminCredentials(body.username, body.password)) {
    return NextResponse.json<AdminLoginResponse>(
      { success: false, data: null, error: "로그인에 실패했습니다." },
      { status: 401 }
    );
  }

  await createAdminSession();

  return NextResponse.json<AdminLoginResponse>({
    success: true,
    data: { message: "로그인되었습니다." },
    error: null
  });
}
