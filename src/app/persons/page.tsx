import { HistoricalCard } from "@/components/historical-card";
import { PageHeading } from "@/components/page-heading";
import { getPersons } from "@/data/history";

export const dynamic = "force-dynamic";

export default async function PersonsPage() {
  const persons = await getPersons();

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 pb-24">
      <PageHeading
        description="대한민국 근대 국가 수립 과정과 관련된 역사적 인물을 하나씩 읽어볼 수 있습니다."
        eyebrow="HISTORICAL FIGURES"
        title="인물백과"
      />

      <div className="mb-10 flex items-center justify-between text-[15px] font-semibold text-historine-muted">
        <span>1-{persons.length} / 총 {persons.length}건</span>
        <span>1 / 1 페이지</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {persons.map((person) => (
          <HistoricalCard
            category={person.category}
            content={person.summary}
            href={`/persons/${person.id}`}
            key={person.id}
            period={person.period}
            tags={person.tags}
            title={person.title}
            tone="main"
          />
        ))}
      </div>
    </div>
  );
}
