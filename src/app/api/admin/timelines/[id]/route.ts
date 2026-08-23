import {
  type AdminRouteContext,
  errorResponse,
  successResponse,
  withAdminAuth,
  withAdminJson
} from "@/lib/admin-route";
import { validateStatusBody, validateTimelineBody } from "@/lib/admin-validators";
import { deleteTimeline, setTimelineStatus, updateTimeline } from "@/repositories/timelines";
import type { UpdateTimelineRequest } from "@/types/api/admin/timeline";

export const PUT = withAdminJson<UpdateTimelineRequest, AdminRouteContext>(
  validateTimelineBody,
  async (body, _request, context) => {
    const { id } = await context.params;
    const timeline = await updateTimeline(id, body);

    if (!timeline) {
      return errorResponse("연표를 찾을 수 없습니다.", 404);
    }

    return successResponse(timeline);
  }
);

export const DELETE = withAdminAuth<AdminRouteContext>(async (_request, context) => {
  const { id } = await context.params;
  const timeline = await deleteTimeline(id);

  if (!timeline) {
    return errorResponse("연표를 찾을 수 없습니다.", 404);
  }

  return successResponse(timeline);
});

export const PATCH = withAdminJson<{ status: "active" | "hidden" | "deleted" }, AdminRouteContext>(
  validateStatusBody,
  async (body, _request, context) => {
    const { id } = await context.params;
    const timeline = await setTimelineStatus(id, body.status);

    if (!timeline) {
      return errorResponse("연표를 찾을 수 없습니다.", 404);
    }

    return successResponse(timeline);
  }
);
