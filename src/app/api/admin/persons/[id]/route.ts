import {
  type AdminRouteContext,
  errorResponse,
  successResponse,
  withAdminAuth,
  withAdminJson
} from "@/lib/admin-route";
import { validateStatusBody, validateEncyclopediaBody } from "@/lib/admin-validators";
import { deletePerson, setPersonStatus, updatePerson } from "@/repositories/persons";
import type {
  UpdateEncyclopediaRequest
} from "@/types/api/admin/encyclopedia";

export const PUT = withAdminJson<UpdateEncyclopediaRequest, AdminRouteContext>(
  validateEncyclopediaBody,
  async (body, _request, context) => {
    const { id } = await context.params;
    const person = await updatePerson(id, body);

    if (!person) {
      return errorResponse("인물을 찾을 수 없습니다.", 404);
    }

    return successResponse(person);
  }
);

export const DELETE = withAdminAuth<AdminRouteContext>(async (_request, context) => {
  const { id } = await context.params;
  const person = await deletePerson(id);

  if (!person) {
    return errorResponse("인물을 찾을 수 없습니다.", 404);
  }

  return successResponse(person);
});

export const PATCH = withAdminJson<{ status: "active" | "hidden" | "deleted" }, AdminRouteContext>(
  validateStatusBody,
  async (body, _request, context) => {
    const { id } = await context.params;
    const person = await setPersonStatus(id, body.status);

    if (!person) {
      return errorResponse("인물을 찾을 수 없습니다.", 404);
    }

    return successResponse(person);
  }
);
