import { BackButton } from "@/components/back-button";
import { EncyclopediaDetailControls } from "@/components/encyclopedia-detail-controls";
import { TagList } from "@/components/tag-list";
import { notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { findPerson } from "@/repositories/persons";

export const dynamic = "force-dynamic";

type PersonDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PersonDetailPage({ params }: PersonDetailPageProps) {
  const { id } = await params;
  const [authenticated, person] = await Promise.all([
    isAdminAuthenticated(),
    findPerson(id)
  ]);

  if (!person) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 py-20">
      <BackButton href="/persons" label="뒤로" />

      <div className="mb-9 text-[15px] font-extrabold tracking-[0.18em] text-historine-side">
        인물 백과 / 상세
      </div>

      <article className="rounded-lg border border-historine-border border-t-4 border-t-historine-side bg-historine-panel p-8 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-3xl border border-historine-side/35 bg-historine-side/10 text-[32px] font-extrabold text-historine-side">
            {person.title[0]}
          </div>
          <div className="flex flex-1 flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-[42px] font-extrabold leading-tight text-historine-text">
                  {person.title}
                </h1>
                <span className="rounded border border-historine-side/35 bg-historine-side/10 px-3 py-1 text-sm font-extrabold text-historine-side">
                  {person.category}
                </span>
              </div>
              <div className="mt-2 text-[18px] font-semibold text-historine-muted">{person.period}</div>
            </div>
            {authenticated ? <EncyclopediaDetailControls item={person} kind="persons" /> : null}
          </div>
        </div>
      </article>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_300px]">
        <section>
          <h2 className="mb-5 border-l-4 border-historine-side pl-3 text-[20px] font-extrabold">
            상세 설명
          </h2>
          <div className="rounded-lg border border-historine-border bg-historine-panel p-8 text-[18px] font-semibold leading-9 text-historine-text">
            {person.content}
          </div>
        </section>
        <aside className="space-y-5">
          <div className="rounded-lg border border-historine-border bg-historine-panel p-6">
            <h2 className="mb-5 text-[16px] font-extrabold text-historine-muted">분류 태그</h2>
            <TagList tags={person.tags} />
          </div>
          <div className="rounded-lg border border-historine-side/20 bg-historine-side/5 p-6">
            <h2 className="mb-4 text-[16px] font-extrabold text-historine-side">한줄 소개</h2>
            <p className="text-[16px] font-semibold leading-8 text-historine-side">{person.summary}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
