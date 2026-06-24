import { prisma } from "@/lib/prisma";
import { parseId, toNumberId } from "@/services/shared";

export type TimelineItem = {
  id: number;
  year: number;
  type: "KOREA" | "WORLD";
  content: string;
};

function toTimelineItem(item: {
  id: bigint;
  year: number;
  type: string;
  content: string;
}): TimelineItem {
  return {
    id: toNumberId(item.id),
    year: item.year,
    type: item.type as TimelineItem["type"],
    content: item.content
  };
}

export async function getTimelines(): Promise<TimelineItem[]> {
  const timelines = await prisma.timeline.findMany({
    orderBy: [{ year: "asc" }, { id: "asc" }]
  });

  return timelines.map(toTimelineItem);
}

export async function addTimeline(item: Omit<TimelineItem, "id">): Promise<TimelineItem> {
  const timeline = await prisma.timeline.create({
    data: item
  });

  return toTimelineItem(timeline);
}

export async function updateTimeline(
  id: string,
  item: Omit<TimelineItem, "id">
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

  return timeline ? toTimelineItem(timeline) : null;
}

export async function deleteTimeline(id: string): Promise<TimelineItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const timeline = await prisma.timeline
    .delete({
      where: { id: parsedId }
    })
    .catch(() => null);

  return timeline ? toTimelineItem(timeline) : null;
}
