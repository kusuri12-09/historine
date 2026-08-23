import type { CreateEncyclopediaRequest } from "@/types/api/admin/encyclopedia";
import type { CreateTimelineRequest } from "@/types/api/admin/timeline";

export const contentStatuses = ["active", "hidden", "deleted"] as const;
export type ContentStatus = (typeof contentStatuses)[number];

export function validateStatusBody(body: unknown) {
  const status = (body as { status?: unknown } | null)?.status;

  if (!contentStatuses.includes(status as ContentStatus)) {
    return { success: false as const, error: "상태 값을 확인해주세요." };
  }

  return { success: true as const, data: { status: status as ContentStatus } };
}

export function validateTimelineBody(body: unknown) {
  const timeline = body as Partial<CreateTimelineRequest> | null;

  if (!timeline?.year || !timeline?.type || !timeline?.content) {
    return { success: false as const, error: "필수 값을 확인해주세요." };
  }

  if (!["KOREA", "WORLD"].includes(timeline.type)) {
    return { success: false as const, error: "연표 타입을 확인해주세요." };
  }

  return {
    success: true as const,
    data: {
      year: Number(timeline.year),
      type: timeline.type,
      content: timeline.content
    }
  };
}

export function validateEncyclopediaBody(body: unknown) {
  const item = body as Partial<CreateEncyclopediaRequest> | null;

  if (!item?.title || !item?.period || !item?.category || !item?.content || !item?.summary) {
    return { success: false as const, error: "필수 값을 확인해주세요." };
  }

  return {
    success: true as const,
    data: {
      title: item.title,
      period: item.period,
      category: item.category,
      tags: item.tags ?? [],
      content: item.content,
      summary: item.summary
    }
  };
}
