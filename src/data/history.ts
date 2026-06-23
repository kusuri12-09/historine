import { prisma } from "@/lib/prisma";

export type TimelineItem = {
  id: number;
  year: number;
  type: "KOREA" | "WORLD";
  content: string;
};

export type EncyclopediaItem = {
  id: number;
  title: string;
  period: string;
  category: string;
  tags: string[];
  content: string;
  summary: string;
};

function toNumberId(id: bigint) {
  return Number(id);
}

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

function toEncyclopediaItem(item: {
  id: bigint;
  title: string;
  period: string;
  category: string;
  tags: string[];
  content: string;
  summary: string;
}): EncyclopediaItem {
  return {
    id: toNumberId(item.id),
    title: item.title,
    period: item.period,
    category: item.category,
    tags: item.tags,
    content: item.content,
    summary: item.summary
  };
}

function parseId(id: string) {
  let parsedId: bigint;

  try {
    parsedId = BigInt(id);
  } catch {
    return null;
  }

  if (parsedId <= BigInt(0)) {
    return null;
  }

  return parsedId;
}

export async function getTimelines(): Promise<TimelineItem[]> {
  const timelines = await prisma.timeline.findMany({
    orderBy: [{ year: "asc" }, { id: "asc" }]
  });

  return timelines.map(toTimelineItem);
}

export async function getPersons(): Promise<EncyclopediaItem[]> {
  const persons = await prisma.person.findMany({
    orderBy: { id: "asc" }
  });

  return persons.map(toEncyclopediaItem);
}

export async function getEvents(): Promise<EncyclopediaItem[]> {
  const events = await prisma.event.findMany({
    orderBy: { id: "asc" }
  });

  return events.map(toEncyclopediaItem);
}

export async function findPerson(id: string): Promise<EncyclopediaItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const person = await prisma.person.findUnique({
    where: { id: parsedId }
  });

  return person ? toEncyclopediaItem(person) : null;
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

export async function addPerson(item: Omit<EncyclopediaItem, "id">): Promise<EncyclopediaItem> {
  const person = await prisma.person.create({
    data: item
  });

  return toEncyclopediaItem(person);
}

export async function updatePerson(
  id: string,
  item: Omit<EncyclopediaItem, "id">
): Promise<EncyclopediaItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const person = await prisma.person
    .update({
      where: { id: parsedId },
      data: item
    })
    .catch(() => null);

  return person ? toEncyclopediaItem(person) : null;
}

export async function deletePerson(id: string): Promise<EncyclopediaItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const person = await prisma.person
    .delete({
      where: { id: parsedId }
    })
    .catch(() => null);

  return person ? toEncyclopediaItem(person) : null;
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
