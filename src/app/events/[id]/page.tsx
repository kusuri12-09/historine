import { BackButton } from "@/components/back-button";
import { EncyclopediaDetailControls } from "@/components/encyclopedia-detail-controls";
import { MarkdownContent } from "@/components/markdown-content";
import { TagList } from "@/components/tag-list";
import { notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { findEvent } from "@/repositories/events";

export const dynamic = "force-dynamic";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const [authenticated, event] = await Promise.all([
    isAdminAuthenticated(),
    findEvent(id)
  ]);

  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 py-20">
      <BackButton href="/events" label="뒤로" />

      <div className="mb-9 text-[15px] font-extrabold tracking-[0.18em] text-historine-side">
        사건 백과 / 상세
      </div>

      <article className="rounded-lg border border-historine-border border-t-4 border-t-historine-main bg-historine-panel p-8 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-3xl border border-historine-main/35 bg-historine-main/10 text-[32px] font-extrabold text-historine-main">
            {event.title[0]}
          </div>
          <div className="flex flex-1 flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-[42px] font-extrabold leading-tight text-historine-text">
                  {event.title}
                </h1>
                <span className="rounded border border-historine-main/35 bg-historine-main/10 px-3 py-1 text-sm font-extrabold text-historine-main">
                  {event.category}
                </span>
              </div>
              <div className="mt-2 text-[18px] font-semibold text-historine-muted">{event.period}</div>
            </div>
            {authenticated ? <EncyclopediaDetailControls item={event} kind="events" /> : null}
          </div>
        </div>
      </article>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_300px]">
        <section>
          <h2 className="mb-5 border-l-4 border-historine-side pl-3 text-[20px] font-extrabold">
            상세 설명
          </h2>
          <MarkdownContent
            className="rounded-lg border border-historine-border bg-historine-panel p-8 text-[18px] font-semibold leading-9 text-historine-text"
            content={event.content}
          />
        </section>
        <aside className="space-y-5">
          <div className="rounded-lg border border-historine-border bg-historine-panel p-6">
            <h2 className="mb-5 text-[16px] font-extrabold text-historine-muted">분류 태그</h2>
            <TagList tags={event.tags} />
          </div>
          <div className="rounded-lg border border-historine-side/20 bg-historine-side/5 p-6">
            <h2 className="mb-4 text-[16px] font-extrabold text-historine-side">한줄 소개</h2>
            <p className="text-[16px] font-semibold leading-8 text-historine-side">{event.summary}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
