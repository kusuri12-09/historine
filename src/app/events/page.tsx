import { EncyclopediaList } from "@/components/encyclopedia-list";
import { PageHeading } from "@/components/page-heading";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getEvents } from "@/repositories/events";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [authenticated, events] = await Promise.all([
    isAdminAuthenticated(),
    getEvents()
  ]);

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 pb-24">
      <PageHeading
        description="근대사의 주요 사건을 배경, 전개, 의미와 함께 개별 문서로 살펴봅니다."
        eyebrow="HISTORICAL EVENTS"
        title="사건백과"
      />

      <EncyclopediaList
        authenticated={authenticated}
        emptyMessage="사건이 없습니다."
        items={events}
        kind="events"
        tone="side"
      />
    </div>
  );
}
