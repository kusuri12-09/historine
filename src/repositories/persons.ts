import { prisma } from "@/lib/prisma";
import {
  type EncyclopediaItem,
  parseId,
  toEncyclopediaItem
} from "@/repositories/shared";

export async function getPersons(): Promise<EncyclopediaItem[]> {
  const persons = await prisma.person.findMany({
    orderBy: { id: "asc" }
  });

  return persons.map(toEncyclopediaItem);
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
