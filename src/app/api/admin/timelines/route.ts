import { NextResponse } from "next/server";
import { addTimeline } from "@/data/history";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        year?: number;
        type?: "KOREA" | "WORLD";
        title?: string;
        content?: string;
      }
    | null;

  if (!body?.year || !body?.type || !body?.title || !body?.content) {
    return NextResponse.json({ message: "필수 값을 확인해주세요." }, { status: 400 });
  }

  if (!["KOREA", "WORLD"].includes(body.type)) {
    return NextResponse.json({ message: "연표 타입을 확인해주세요." }, { status: 400 });
  }

  const timeline = addTimeline({
    year: Number(body.year),
    type: body.type,
    title: body.title,
    content: body.content
  });

  return NextResponse.json({ data: timeline }, { status: 201 });
}
