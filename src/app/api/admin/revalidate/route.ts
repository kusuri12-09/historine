import { revalidateTag } from "next/cache";
import { successResponse, withAdminAuth } from "@/lib/admin-route";
import { HISTORY_CACHE_TAG } from "@/lib/cache-tags";
import type { RevalidateResponseData } from "@/types/api/admin/revalidate";

export const POST = withAdminAuth(() => {
  revalidateTag(HISTORY_CACHE_TAG);

  return successResponse<RevalidateResponseData>({
    revalidated: true,
    tag: HISTORY_CACHE_TAG
  });
});
