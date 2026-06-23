import { NextResponse } from "next/server";
import { deleteEvent, updateEvent } from "@/data/history";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import type { ApiResponse } from "@/types/api/common";
import type {
  DeleteEncyclopediaResponse,
  UpdateEncyclopediaRequest,
  UpdateEncyclopediaResponse
} from "@/types/api/admin/encyclopedia";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, error: "관리자 인증이 필요합니다." },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as Partial<UpdateEncyclopediaRequest> | null;

  if (!body?.title || !body?.period || !body?.category || !body?.content || !body?.summary) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, error: "필수 값을 확인해주세요." },
      { status: 400 }
    );
  }

  const { id } = await context.params;
  const event = await updateEvent(id, {
    title: body.title,
    period: body.period,
    category: body.category,
    tags: body.tags ?? [],
    content: body.content,
    summary: body.summary
  });

  if (!event) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, error: "사건을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json<UpdateEncyclopediaResponse>({
    success: true,
    data: event,
    error: null
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, error: "관리자 인증이 필요합니다." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const event = await deleteEvent(id);

  if (!event) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, error: "사건을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json<DeleteEncyclopediaResponse>({
    success: true,
    data: event,
    error: null
  });
}
