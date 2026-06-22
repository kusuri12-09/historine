import { NextResponse } from "next/server";
import { createAdminSession, validateAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  if (!body?.username || !body?.password) {
    return NextResponse.json({ message: "로그인 정보를 확인해주세요." }, { status: 400 });
  }

  if (!validateAdminCredentials(body.username, body.password)) {
    return NextResponse.json({ message: "로그인에 실패했습니다." }, { status: 401 });
  }

  await createAdminSession();

  return NextResponse.json({ message: "로그인되었습니다." });
}
