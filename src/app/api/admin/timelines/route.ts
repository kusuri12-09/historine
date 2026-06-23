import { NextResponse } from "next/server";
import { addTimeline } from "@/data/history";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import type { CreateTimelineRequest, CreateTimelineResponse } from "@/types/api/admin/timeline";

// timeline 추가
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json<CreateTimelineResponse>(
      { success: false, data: null, error: "관리자 인증이 필요합니다." },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as Partial<CreateTimelineRequest> | null;

  if (!body?.year || !body?.type || !body?.content) {
    return NextResponse.json<CreateTimelineResponse>(
      { success: false, data: null, error: "필수 값을 확인해주세요." },
      { status: 400 }
    );
  }

  if (!["KOREA", "WORLD"].includes(body.type)) {
    return NextResponse.json<CreateTimelineResponse>(
      { success: false, data: null, error: "연표 타입을 확인해주세요." },
      { status: 400 }
    );
  }

  const timeline = await addTimeline({
    year: Number(body.year),
    type: body.type,
    content: body.content
  });

  return NextResponse.json<CreateTimelineResponse>(
    { success: true, data: timeline, error: null },
    { status: 201 }
  );
}
