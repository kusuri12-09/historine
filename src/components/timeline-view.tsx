import { MarkdownContent } from "@/components/markdown-content";
import { PageHeading } from "@/components/page-heading";
import { TimelineCreateModal } from "@/components/timeline-create-modal";
import { TimelineItemControls } from "@/components/timeline-item-controls";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { type TimelineItem, getTimelines } from "@/repositories/timelines";

type TimelineGroup = {
  key: string;
  year: number;
  type: TimelineItem["type"];
  items: TimelineItem[];
};

function timelineTone(type: "KOREA" | "WORLD") {
  return type === "KOREA"
    ? {
        border: "border-historine-main/40",
        bg: "bg-historine-main/10",
        text: "text-historine-main"
      }
    : {
        border: "border-historine-side/40",
        bg: "bg-historine-side/10",
        text: "text-historine-side"
      };
}

function groupTimelines(items: TimelineItem[]) {
  const groups = new Map<string, TimelineGroup>();

  items.forEach((item) => {
    const key = `${item.type}:${item.year}`;
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.items.push(item);
      return;
    }

    groups.set(key, {
      key,
      year: item.year,
      type: item.type,
      items: [item]
    });
  });

  return [...groups.values()];
}

export async function TimelineView() {
  const [authenticated, sortedTimelines] = await Promise.all([
    isAdminAuthenticated(),
    getTimelines()
  ]);
  const timelineGroups = groupTimelines(sortedTimelines);

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 pb-24">
      <PageHeading
        description="대한민국 근현대사(1900년~)의 주요 흐름을 시간 순서로 확인합니다."
        eyebrow="CHRONOLOGICAL ARCHIVE"
        title="대한민국 근현대사 연표"
      />

      {authenticated ? (
        <div className="mb-8 flex justify-end">
          <TimelineCreateModal />
        </div>
      ) : null}

      {sortedTimelines.length === 0 ? (
        <div className="rounded-lg border border-historine-border bg-historine-panel p-7 text-historine-muted">
          등록된 연표가 없습니다.
        </div>
      ) : (
        <div className="relative" aria-label="대한민국 근현대사 연표">
          <div className="absolute left-[72px] top-[35px] hidden h-[calc(100%-70px)] w-1 -translate-x-1/2 rounded-full bg-historine-main md:block" />
          <div className="relative z-10 space-y-20">
            {timelineGroups.map((group) => {
              const tone = timelineTone(group.type);

              return (
                <article
                  className="relative grid items-start gap-6 md:grid-cols-[144px_1fr] md:gap-14"
                  key={group.key}
                >
                  <div className="relative flex md:justify-center">
                    <div className="absolute left-1/2 hidden h-[74px] w-[128px] -translate-x-1/2 rounded-2xl bg-historine-bg md:block" />
                    <div
                      className={`relative z-10 flex h-[70px] w-[124px] items-center justify-center rounded-2xl border ${tone.border} ${tone.bg} ${tone.text} text-[15px] font-extrabold`}
                    >
                      {group.year}
                    </div>
                  </div>
                  <div className="space-y-5">
                    {group.items.map((item) => (
                      <div className="group relative scroll-mt-24" id={`timeline-${item.id}`} key={item.id}>
                        {authenticated ? (
                          <div className="absolute right-0 top-0 z-10">
                            <TimelineItemControls item={item} />
                          </div>
                        ) : null}
                        <MarkdownContent
                          className="max-w-4xl text-[17px] leading-8 text-historine-muted"
                          content={item.content}
                        />
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
