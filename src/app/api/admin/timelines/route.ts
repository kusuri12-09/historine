import { successResponse, withAdminJson } from "@/lib/admin-route";
import { validateTimelineBody } from "@/lib/admin-validators";
import { addTimeline } from "@/repositories/timelines";

export const POST = withAdminJson(validateTimelineBody, async (body) => {
  const timeline = await addTimeline(body);
  return successResponse(timeline, 201);
});
