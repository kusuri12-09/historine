import { PageHeading } from "@/components/page-heading";
import { TimelineCreateModal } from "@/components/timeline-create-modal";
import { TimelineItemControls } from "@/components/timeline-item-controls";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getTimelines } from "@/repositories/timelines";

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

export async function TimelineView() {
  const [authenticated, sortedTimelines] = await Promise.all([
    isAdminAuthenticated(),
    getTimelines()
  ]);

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 pb-24">
      <PageHeading
        description="1800년대 후반부터 1900년대 극초반까지의 주요 흐름을 시간 순서로 확인합니다."
        eyebrow="CHRONOLOGICAL ARCHIVE"
        title="근대 국가 수립 연표"
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
        <div className="relative" aria-label="근대 국가 수립 연표">
          <div className="absolute left-[72px] top-[35px] hidden h-[calc(100%-70px)] w-1 -translate-x-1/2 rounded-full bg-historine-main md:block" />
          <div className="relative z-10 space-y-20">
            {sortedTimelines.map((item) => {
              const tone = timelineTone(item.type);

              return (
                <article
                  className="group relative grid gap-6 md:grid-cols-[144px_1fr] md:gap-14"
                  key={item.id}
                >
                  <div className="relative flex md:justify-center">
                    <div className="absolute left-1/2 hidden h-[74px] w-[128px] -translate-x-1/2 rounded-2xl bg-historine-bg md:block" />
                    <div
                      className={`relative z-10 flex h-[70px] w-[124px] items-center justify-center rounded-2xl border ${tone.border} ${tone.bg} ${tone.text} text-[15px] font-extrabold`}
                    >
                      {item.year}
                    </div>
                  </div>
                  <div className="pt-1">
                    {authenticated ? (
                      <div className="mb-3 flex justify-end">
                        <TimelineItemControls item={item} />
                      </div>
                    ) : null}
                    <p className="max-w-4xl text-[17px] leading-8 text-historine-muted">
                      {item.content}
                    </p>
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
