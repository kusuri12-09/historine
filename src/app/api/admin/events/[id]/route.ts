import {
  type AdminRouteContext,
  errorResponse,
  successResponse,
  withAdminAuth,
  withAdminJson
} from "@/lib/admin-route";
import { validateStatusBody, validateEncyclopediaBody } from "@/lib/admin-validators";
import { deleteEvent, setEventStatus, updateEvent } from "@/repositories/events";
import type {
  UpdateEncyclopediaRequest
} from "@/types/api/admin/encyclopedia";

export const PUT = withAdminJson<UpdateEncyclopediaRequest, AdminRouteContext>(
  validateEncyclopediaBody,
  async (body, _request, context) => {
    const { id } = await context.params;
    const event = await updateEvent(id, body);

    if (!event) {
      return errorResponse("사건을 찾을 수 없습니다.", 404);
    }

    return successResponse(event);
  }
);

export const DELETE = withAdminAuth<AdminRouteContext>(async (_request, context) => {
  const { id } = await context.params;
  const event = await deleteEvent(id);

  if (!event) {
    return errorResponse("사건을 찾을 수 없습니다.", 404);
  }

  return successResponse(event);
});

export const PATCH = withAdminJson<{ status: "active" | "hidden" | "deleted" }, AdminRouteContext>(
  validateStatusBody,
  async (body, _request, context) => {
    const { id } = await context.params;
    const event = await setEventStatus(id, body.status);

    if (!event) {
      return errorResponse("사건을 찾을 수 없습니다.", 404);
    }

    return successResponse(event);
  }
);
