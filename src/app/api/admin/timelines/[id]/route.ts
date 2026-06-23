import { NextResponse } from "next/server";
import { deleteTimeline, updateTimeline } from "@/data/history";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import type {
  DeleteTimelineResponse,
  UpdateTimelineRequest,
  UpdateTimelineResponse
} from "@/types/api/admin/timeline";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json<UpdateTimelineResponse>(
      { success: false, data: null, error: "관리자 인증이 필요합니다." },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as Partial<UpdateTimelineRequest> | null;

  if (!body?.year || !body?.type || !body?.content) {
    return NextResponse.json<UpdateTimelineResponse>(
      { success: false, data: null, error: "필수 값을 확인해주세요." },
      { status: 400 }
    );
  }

  if (!["KOREA", "WORLD"].includes(body.type)) {
    return NextResponse.json<UpdateTimelineResponse>(
      { success: false, data: null, error: "연표 타입을 확인해주세요." },
      { status: 400 }
    );
  }

  const { id } = await context.params;
  const timeline = await updateTimeline(id, {
    year: Number(body.year),
    type: body.type,
    content: body.content
  });

  if (!timeline) {
    return NextResponse.json<UpdateTimelineResponse>(
      { success: false, data: null, error: "연표를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json<UpdateTimelineResponse>({
    success: true,
    data: timeline,
    error: null
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json<DeleteTimelineResponse>(
      { success: false, data: null, error: "관리자 인증이 필요합니다." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const timeline = await deleteTimeline(id);

  if (!timeline) {
    return NextResponse.json<DeleteTimelineResponse>(
      { success: false, data: null, error: "연표를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json<DeleteTimelineResponse>({
    success: true,
    data: timeline,
    error: null
  });
}
