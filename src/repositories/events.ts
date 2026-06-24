import { prisma } from "@/lib/prisma";
import {
  type EncyclopediaItem,
  parseId,
  toEncyclopediaItem
} from "@/repositories/shared";

export async function getEvents(): Promise<EncyclopediaItem[]> {
  const events = await prisma.event.findMany({
    orderBy: { id: "asc" }
  });

  return events.map(toEncyclopediaItem);
}

export async function findEvent(id: string): Promise<EncyclopediaItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const event = await prisma.event.findUnique({
    where: { id: parsedId }
  });

  return event ? toEncyclopediaItem(event) : null;
}

export async function addEvent(item: Omit<EncyclopediaItem, "id">): Promise<EncyclopediaItem> {
  const event = await prisma.event.create({
    data: item
  });

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

  return event ? toEncyclopediaItem(event) : null;
}
