export type ContentStatus = "active" | "hidden" | "deleted";

export type EncyclopediaItem = {
  id: number;
  title: string;
  period: string;
  category: string;
  tags: string[];
  content: string;
  summary: string;
  status: ContentStatus;
};

export function toNumberId(id: bigint) {
  return Number(id);
}

export function parseId(id: string) {
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

export function toEncyclopediaItem(item: {
  id: bigint;
  title: string;
  period: string;
  category: string;
  tags: string[];
  content: string;
  summary: string;
  status: string;
}): EncyclopediaItem {
  return {
    id: toNumberId(item.id),
    title: item.title,
    period: item.period,
    category: item.category,
    tags: item.tags,
    content: item.content,
    summary: item.summary,
    status: item.status as ContentStatus
  };
}
