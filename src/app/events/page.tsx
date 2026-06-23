import { HistoricalCard } from "@/components/historical-card";
import { PageHeading } from "@/components/page-heading";
import { getEvents } from "@/data/history";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 pb-24">
      <PageHeading
        description="근대사의 주요 사건을 배경, 전개, 의미와 함께 개별 문서로 살펴봅니다."
        eyebrow="HISTORICAL EVENTS"
        title="사건백과"
      />

      <div className="mb-10 flex items-center justify-between text-[15px] font-semibold text-historine-muted">
        <span>1-{events.length} / 총 {events.length}건</span>
        <span>1 / 1 페이지</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <HistoricalCard
            category={event.category}
            content={event.summary}
            href={`/events/${event.id}`}
            key={event.id}
            period={event.period}
            tags={event.tags}
            title={event.title}
            tone="side"
          />
        ))}
      </div>
    </div>
  );
}
