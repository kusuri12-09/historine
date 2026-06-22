import { NextResponse } from "next/server";
import { addPerson } from "@/data/history";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: string;
        period?: string;
        category?: string;
        tags?: string[];
        content?: string;
        summary?: string;
      }
    | null;

  if (!body?.title || !body?.period || !body?.category || !body?.content || !body?.summary) {
    return NextResponse.json({ message: "필수 값을 확인해주세요." }, { status: 400 });
  }

  const person = addPerson({
    title: body.title,
    period: body.period,
    category: body.category,
    tags: body.tags ?? [],
    content: body.content,
    summary: body.summary
  });

  return NextResponse.json({ data: person }, { status: 201 });
}
