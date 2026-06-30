"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EncyclopediaCreateModal } from "@/components/encyclopedia-create-modal";
import { HistoricalCard } from "@/components/historical-card";
import type { EncyclopediaItem } from "@/repositories/shared";

type EncyclopediaKind = "persons" | "events";
type SortKey = "default" | "title" | "period";
type SortOrder = "asc" | "desc";

type EncyclopediaListProps = {
  authenticated: boolean;
  emptyMessage: string;
  items: EncyclopediaItem[];
  kind: EncyclopediaKind;
  tone: "main" | "side";
};

const sortLabels: Record<SortKey, string> = {
  default: "기본",
  title: "이름순",
  period: "기간순"
};

const orderLabels: Record<SortOrder, string> = {
  asc: "오름차순",
  desc: "내림차순"
};

function isSortKey(value: string | null): value is SortKey {
  return value === "default" || value === "title" || value === "period";
}

function isSortOrder(value: string | null): value is SortOrder {
  return value === "asc" || value === "desc";
}

function getPeriodStartYear(period: string) {
  const match = period.match(/\d{4}/);

  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function getSavedSort(storageKey: string) {
  try {
    const savedValue = window.localStorage.getItem(storageKey);

    return savedValue ? JSON.parse(savedValue) as Partial<{ sort: string; order: string }> : null;
  } catch {
    return null;
  }
}

function compareItems(a: EncyclopediaItem, b: EncyclopediaItem, sort: SortKey) {
  if (sort === "title") {
    return a.title.localeCompare(b.title, "ko-KR", { numeric: true });
  }

  if (sort === "period") {
    const yearDiff = getPeriodStartYear(a.period) - getPeriodStartYear(b.period);

    return yearDiff || a.id - b.id;
  }

  return a.id - b.id;
}

export function EncyclopediaList({
  authenticated,
  emptyMessage,
  items,
  kind,
  tone
}: EncyclopediaListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const storageKey = `historine:${kind}:sort`;
  const [sort, setSort] = useState<SortKey>("default");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const querySort = searchParams.get("sort");
    const queryOrder = searchParams.get("order");
    const saved = getSavedSort(storageKey);
    const savedSort = saved?.sort ?? null;
    const savedOrder = saved?.order ?? null;

    setSort(isSortKey(querySort) ? querySort : isSortKey(savedSort) ? savedSort : "default");
    setOrder(isSortOrder(queryOrder) ? queryOrder : isSortOrder(savedOrder) ? savedOrder : "asc");
    setHydrated(true);
  }, [searchParams, storageKey]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify({ sort, order }));
  }, [hydrated, order, sort, storageKey]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const result = compareItems(a, b, sort);

      return order === "asc" ? result : -result;
    });
  }, [items, order, sort]);

  function updateSort(nextSort: SortKey) {
    setSort(nextSort);
    updateUrl(nextSort, order);
  }

  function updateOrder(nextOrder: SortOrder) {
    setOrder(nextOrder);
    updateUrl(sort, nextOrder);
  }

  function updateUrl(nextSort: SortKey, nextOrder: SortOrder) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", nextSort);
    params.set("order", nextOrder);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 text-[15px] font-semibold text-historine-muted">
        <span>1-{items.length} / 총 {items.length}건</span>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="sr-only">정렬 기준</span>
            <select
              className={selectClassName}
              onChange={(event) => updateSort(event.target.value as SortKey)}
              value={sort}
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="sr-only">정렬 방향</span>
            <select
              className={selectClassName}
              onChange={(event) => updateOrder(event.target.value as SortOrder)}
              value={order}
            >
              {Object.entries(orderLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <span>1 / 1 페이지</span>
          {authenticated ? <EncyclopediaCreateModal kind={kind} /> : null}
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <div className="rounded-lg border border-historine-border bg-historine-panel p-7 text-historine-muted">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedItems.map((item) => (
            <HistoricalCard
              category={item.category}
              content={item.summary}
              href={`/${kind}/${item.id}`}
              key={item.id}
              period={item.period}
              tags={item.tags}
              title={item.title}
              tone={tone}
            />
          ))}
        </div>
      )}
    </>
  );
}

const selectClassName =
  "h-12 rounded border border-historine-border bg-[#151515] px-3 text-[15px] font-bold text-historine-text outline-none transition focus:border-historine-main";
