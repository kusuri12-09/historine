import { successResponse, withAdminJson } from "@/lib/admin-route";
import { validateEncyclopediaBody } from "@/lib/admin-validators";
import { addEvent } from "@/repositories/events";

export const POST = withAdminJson(validateEncyclopediaBody, async (body) => {
  const event = await addEvent(body);
  return successResponse(event, 201);
});
