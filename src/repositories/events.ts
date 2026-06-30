import { revalidateTag, unstable_cache } from "next/cache";
import { HISTORY_CACHE_TAG } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import {
  type EncyclopediaItem,
  parseId,
  toEncyclopediaItem
} from "@/repositories/shared";

const cachedGetEvents = unstable_cache(
  async (): Promise<EncyclopediaItem[]> => {
    const events = await prisma.event.findMany({
      orderBy: { id: "asc" }
    });

    return events.map(toEncyclopediaItem);
  },
  ["events"],
  { tags: [HISTORY_CACHE_TAG], revalidate: 60 * 5 }
);

const cachedFindEvent = unstable_cache(
  async (id: string): Promise<EncyclopediaItem | null> => {
    const parsedId = parseId(id);

    if (!parsedId) {
      return null;
    }

    const event = await prisma.event.findUnique({
      where: { id: parsedId }
    });

    return event ? toEncyclopediaItem(event) : null;
  },
  ["event-detail"],
  { tags: [HISTORY_CACHE_TAG], revalidate: 60 * 5 }
);

export async function getEvents(): Promise<EncyclopediaItem[]> {
  return cachedGetEvents();
}

export async function findEvent(id: string): Promise<EncyclopediaItem | null> {
  return cachedFindEvent(id);
}

export async function findEventsByIds(ids: bigint[]): Promise<EncyclopediaItem[]> {
  if (ids.length === 0) {
    return [];
  }

  const events = await prisma.event.findMany({
    where: {
      id: {
        in: ids
      }
    }
  });

  return events.map(toEncyclopediaItem);
}

export async function addEvent(item: Omit<EncyclopediaItem, "id">): Promise<EncyclopediaItem> {
  const event = await prisma.event.create({
    data: item
  });

  revalidateTag(HISTORY_CACHE_TAG);

  return toEncyclopediaItem(event);
}

export async function updateEvent(
  id: string,
  item: Omit<EncyclopediaItem, "id">
): Promise<EncyclopediaItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const event = await prisma.event
    .update({
      where: { id: parsedId },
      data: item
    })
    .catch(() => null);

  if (event) {
    revalidateTag(HISTORY_CACHE_TAG);
  }

  return event ? toEncyclopediaItem(event) : null;
}

export async function deleteEvent(id: string): Promise<EncyclopediaItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const event = await prisma.event
    .delete({
      where: { id: parsedId }
    })
    .catch(() => null);

  if (event) {
    revalidateTag(HISTORY_CACHE_TAG);
  }

  return event ? toEncyclopediaItem(event) : null;
}
