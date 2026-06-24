import { findEventsByIds } from "@/repositories/events";
import { findPersonsByIds } from "@/repositories/persons";
import { findTimelinesByIds } from "@/repositories/timelines";

type MentionType = "timeline" | "person" | "event";

type MentionLink = {
  label: string;
  url: string;
};

const mentionPattern = /@\((timeline|person|event):(\d+)\)/g;

function collectMentionIds(content: string) {
  const idsByType: Record<MentionType, Set<bigint>> = {
    timeline: new Set(),
    person: new Set(),
    event: new Set()
  };

  for (const match of content.matchAll(mentionPattern)) {
    idsByType[match[1] as MentionType].add(BigInt(match[2]));
  }

  return idsByType;
}

function mentionKey(type: MentionType, id: number) {
  return `${type}:${id}`;
}

export async function renderMarkdownMentions(content: string) {
  const idsByType = collectMentionIds(content);

  if (
    idsByType.timeline.size === 0 &&
    idsByType.person.size === 0 &&
    idsByType.event.size === 0
  ) {
    return content;
  }

  const [timelines, persons, events] = await Promise.all([
    findTimelinesByIds([...idsByType.timeline]),
    findPersonsByIds([...idsByType.person]),
    findEventsByIds([...idsByType.event])
  ]);

  const links = new Map<string, MentionLink>();

  timelines.forEach((timeline) => {
    links.set(mentionKey("timeline", timeline.id), {
      label: `${timeline.year}년 연표`,
      url: `/timeline#timeline-${timeline.id}`
    });
  });

  persons.forEach((person) => {
    links.set(mentionKey("person", person.id), {
      label: person.title,
      url: `/persons/${person.id}`
    });
  });

  events.forEach((event) => {
    links.set(mentionKey("event", event.id), {
      label: event.title,
      url: `/events/${event.id}`
    });
  });

  return content.replace(mentionPattern, (source, type: MentionType, rawId: string) => {
    const id = Number(rawId);
    const link = links.get(mentionKey(type, id));

    if (!link) {
      return source;
    }

    return `[@${link.label}](${link.url})`;
  });
}
