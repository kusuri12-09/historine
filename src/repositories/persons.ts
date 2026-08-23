import { revalidateTag, unstable_cache } from "next/cache";
import { HISTORY_CACHE_TAG } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import {
  type EncyclopediaItem,
  parseId,
  toEncyclopediaItem
} from "@/repositories/shared";

const cachedGetPersons = unstable_cache(
  async (): Promise<EncyclopediaItem[]> => {
    const persons = await prisma.person.findMany({
      where: { status: "active" },
      orderBy: { id: "asc" }
    });

    return persons.map(toEncyclopediaItem);
  },
  ["persons"],
  { tags: [HISTORY_CACHE_TAG], revalidate: 60 * 5 }
);

const cachedFindPerson = unstable_cache(
  async (id: string): Promise<EncyclopediaItem | null> => {
    const parsedId = parseId(id);

    if (!parsedId) {
      return null;
    }

    const person = await prisma.person.findFirst({
      where: { id: parsedId, status: "active" }
    });

    return person ? toEncyclopediaItem(person) : null;
  },
  ["person-detail"],
  { tags: [HISTORY_CACHE_TAG], revalidate: 60 * 5 }
);

export async function getPersons(): Promise<EncyclopediaItem[]> {
  return cachedGetPersons();
}

export async function getAdminPersons(): Promise<EncyclopediaItem[]> {
  const persons = await prisma.person.findMany({ orderBy: { id: "asc" } });
  return persons.map(toEncyclopediaItem);
}

export async function findPerson(id: string): Promise<EncyclopediaItem | null> {
  return cachedFindPerson(id);
}

export async function findPersonsByIds(ids: bigint[]): Promise<EncyclopediaItem[]> {
  if (ids.length === 0) {
    return [];
  }

  const persons = await prisma.person.findMany({
    where: {
      id: {
        in: ids
      },
      status: "active"
    }
  });

  return persons.map(toEncyclopediaItem);
}

export async function addPerson(item: Omit<EncyclopediaItem, "id" | "status">): Promise<EncyclopediaItem> {
  const person = await prisma.person.create({
    data: item
  });

  revalidateTag(HISTORY_CACHE_TAG);

  return toEncyclopediaItem(person);
}

export async function updatePerson(
  id: string,
  item: Omit<EncyclopediaItem, "id" | "status">
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

  if (person) {
    revalidateTag(HISTORY_CACHE_TAG);
  }

  return person ? toEncyclopediaItem(person) : null;
}

export async function setPersonStatus(id: string, status: "active" | "hidden" | "deleted"): Promise<EncyclopediaItem | null> {
  const parsedId = parseId(id);

  if (!parsedId) {
    return null;
  }

  const person = await prisma.person
    .update({
      where: { id: parsedId },
      data: { status }
    })
    .catch(() => null);

  if (person) {
    revalidateTag(HISTORY_CACHE_TAG);
  }

  return person ? toEncyclopediaItem(person) : null;
}

export const deletePerson = (id: string) => setPersonStatus(id, "deleted");
