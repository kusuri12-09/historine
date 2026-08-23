import { revalidateTag, unstable_cache } from "next/cache";
import { HISTORY_CACHE_TAG } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import { parseId, toNumberId } from "@/repositories/shared";
import type { ContentStatus } from "@/repositories/shared";

export type TimelineItem = {
  id: number;
  year: number;
  type: "KOREA" | "WORLD";
  content: string;
  status: ContentStatus;
};

function toTimelineItem(item: {
  id: bigint;
  year: number;
  type: string;
  content: string;
  status: string;
}): TimelineItem {
  return {
    id: toNumberId(item.id),
    year: item.year,
    type: item.type as TimelineItem["type"],
    content: item.content,
    status: item.status as ContentStatus
  };
}

const cachedGetTimelines = unstable_cache(
  async (): Promise<TimelineItem[]> => {
    const timelines = await prisma.timeline.findMany({
      where: { status: "active" },
      orderBy: [{ year: "asc" }, { id: "asc" }]
    });

    return timelines.map(toTimelineItem);
  },
  ["timelines"],
  { tags: [HISTORY_CACHE_TAG], revalidate: 60 * 5 }
);

export async function getTimelines(): Promise<TimelineItem[]> {
  return cachedGetTimelines();
}

export async function getAdminTimelines(): Promise<TimelineItem[]> {
  const timelines = await prisma.timeline.findMany({
    orderBy: [{ year: "asc" }, { id: "asc" }]
  });

  return timelines.map(toTimelineItem);
}

export async function findTimelinesByIds(ids: bigint[]): Promise<TimelineItem[]> {
  if (ids.length === 0) {
    return [];
  }

  const timelines = await prisma.timeline.findMany({
    where: {
      id: {
        in: ids
      },
      status: "active"
    }
  });

  return timelines.map(toTimelineItem);
}

export async function addTimeline(item: Omit<TimelineItem, "id" | "status">): Promise<TimelineItem> {
  const timeline = await prisma.timeline.create({
    data: item
  });

  revalidateTag(HISTORY_CACHE_TAG);

  return toTimelineItem(timeline);
}

export async function updateTimeline(
  id: string,
  item: Omit<TimelineItem, "id" | "status">
): Promise<TimelineItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const timeline = await prisma.timeline
    .update({
      where: { id: parsedId },
      data: item
    })
    .catch(() => null);

  if (timeline) {
    revalidateTag(HISTORY_CACHE_TAG);
  }

  return timeline ? toTimelineItem(timeline) : null;
}

export async function setTimelineStatus(id: string, status: ContentStatus): Promise<TimelineItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const timeline = await prisma.timeline
    .update({
      where: { id: parsedId },
      data: { status }
    })
    .catch(() => null);

  if (timeline) {
    revalidateTag(HISTORY_CACHE_TAG);
  }

  return timeline ? toTimelineItem(timeline) : null;
}

export const deleteTimeline = (id: string) => setTimelineStatus(id, "deleted");
