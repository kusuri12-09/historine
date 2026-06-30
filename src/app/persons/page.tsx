import { EncyclopediaList } from "@/components/encyclopedia-list";
import { PageHeading } from "@/components/page-heading";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPersons } from "@/repositories/persons";

export const dynamic = "force-dynamic";

export default async function PersonsPage() {
  const [authenticated, persons] = await Promise.all([
    isAdminAuthenticated(),
    getPersons()
  ]);

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 pb-24">
      <PageHeading
        description="대한민국 근대 국가 수립 과정과 관련된 역사적 인물을 하나씩 읽어볼 수 있습니다."
        eyebrow="HISTORICAL FIGURES"
        title="인물백과"
      />

      <EncyclopediaList
        authenticated={authenticated}
        emptyMessage="인물이 없습니다."
        items={persons}
        kind="persons"
        tone="main"
      />
    </div>
  );
}
