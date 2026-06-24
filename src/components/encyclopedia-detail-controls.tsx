"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";
import { csrfHeader } from "@/lib/client-csrf";
import type { ApiResponse } from "@/types/api/common";
import type { EncyclopediaResponseData } from "@/types/api/encyclopedia";

type EncyclopediaKind = "persons" | "events";

type EncyclopediaDetailControlsProps = {
  item: EncyclopediaResponseData;
  kind: EncyclopediaKind;
};

type Message = {
  type: "success" | "error";
  text: string;
};

function parseTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function requestJson(url: string, method: "PUT" | "DELETE", body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...csrfHeader()
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "요청 처리에 실패했습니다.");
  }

  return payload;
}

export function EncyclopediaDetailControls({ item, kind }: EncyclopediaDetailControlsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState<"delete" | "update" | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const label = kind === "persons" ? "인물" : "사건";
  const listHref = kind === "persons" ? "/persons" : "/events";

  async function handleDelete() {
    if (pending) {
      return;
    }

    setPending("delete");

    try {
      await requestJson(`/api/admin/${kind}/${item.id}`, "DELETE");
      router.push(listHref);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : `${label} 백과 삭제에 실패했습니다.`
      });
      setPending(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setPending("update");
    setMessage({ type: "success", text: `${label} 백과 수정 요청을 처리하고 있습니다.` });

    try {
      await requestJson(`/api/admin/${kind}/${item.id}`, "PUT", {
        title: formData.get("title"),
        period: formData.get("period"),
        category: formData.get("category"),
        tags: parseTags(formData.get("tags")),
        summary: formData.get("summary"),
        content: formData.get("content")
      });
      setMessage({ type: "success", text: `${label} 백과 카드가 반영되었습니다.` });
      setEditing(false);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : `${label} 백과 수정에 실패했습니다.`
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button className={outlineButtonClassName} onClick={() => setEditing(true)} type="button">
          수정
        </button>
        <button
          className={dangerButtonClassName}
          disabled={pending === "delete"}
          onClick={handleDelete}
          type="button"
        >
          {pending === "delete" ? <LoadingSpinner label="삭제 중" /> : "삭제"}
        </button>
      </div>

      {message && !editing ? (
        <div
          className={[
            "mt-3 rounded border p-3 text-sm font-bold",
            message.type === "success"
              ? "border-historine-main/40 bg-historine-main/10 text-historine-main"
              : "border-red-400/40 bg-red-400/10 text-red-300"
          ].join(" ")}
        >
          {message.text}
        </div>
      ) : null}

      {editing ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 py-8"
          role="dialog"
        >
          <div className="max-h-full w-full max-w-[720px] overflow-y-auto rounded-lg border border-historine-border bg-historine-panel p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[24px] font-extrabold text-historine-text">
                  {label} 백과 카드 수정
                </h2>
                <p className="mt-2 text-[15px] leading-6 text-historine-muted">
                  선택한 백과 카드의 제목, 기간, 분류, 요약과 상세 내용을 수정합니다.
                </p>
              </div>
              <button
                aria-label="닫기"
                className="rounded border border-historine-border px-3 py-2 text-sm font-bold text-historine-muted transition hover:border-historine-main hover:text-historine-main disabled:cursor-not-allowed disabled:opacity-60"
                disabled={pending === "update"}
                onClick={() => setEditing(false)}
                type="button"
              >
                닫기
              </button>
            </div>

            {message ? (
              <div
                className={[
                  "mb-5 rounded border p-3 text-sm font-bold",
                  message.type === "success"
                    ? "border-historine-main/40 bg-historine-main/10 text-historine-main"
                    : "border-red-400/40 bg-red-400/10 text-red-300"
                ].join(" ")}
              >
                {message.text}
              </div>
            ) : null}

            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <TextField defaultValue={item.title} disabled={pending === "update"} label="제목" name="title" required />
              <TextField defaultValue={item.period} disabled={pending === "update"} label="기간" name="period" required />
              <TextField defaultValue={item.category} disabled={pending === "update"} label="분류" name="category" required />
              <TextField
                defaultValue={item.tags.join(", ")}
                disabled={pending === "update"}
                label="태그"
                name="tags"
                placeholder="쉼표로 구분"
              />
              <div className="md:col-span-2">
                <TextField defaultValue={item.summary} disabled={pending === "update"} label="한줄 소개" name="summary" required />
              </div>
              <div className="md:col-span-2">
                <TextField
                  defaultValue={item.content}
                  disabled={pending === "update"}
                  label="상세 내용"
                  multiline
                  name="content"
                  required
                  rows={4}
                />
              </div>
              <button
                className={`${buttonClassName} md:w-fit disabled:cursor-not-allowed disabled:opacity-60`}
                disabled={pending === "update"}
                type="submit"
              >
                {pending === "update" ? <LoadingSpinner label="수정 중" /> : "백과 수정"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function TextField({
  defaultValue,
  disabled,
  label,
  multiline = false,
  name,
  placeholder,
  required,
  rows
}: {
  defaultValue?: string;
  disabled: boolean;
  label: string;
  multiline?: boolean;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-historine-muted">
      {label}
      {multiline ? (
        <textarea
          className={`${fieldClassName} min-h-28 resize-y py-3`}
          defaultValue={defaultValue}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          className={fieldClassName}
          defaultValue={defaultValue}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          required={required}
          type="text"
        />
      )}
    </label>
  );
}

const buttonClassName =
  "h-12 rounded bg-historine-main px-5 text-[15px] font-extrabold text-historine-bg transition hover:bg-[#8BAFDA]";

const outlineButtonClassName =
  "rounded border border-historine-main px-3 py-2 text-sm font-extrabold text-historine-main transition hover:bg-historine-main/10";

const dangerButtonClassName =
  "rounded border border-red-400/60 px-3 py-2 text-sm font-extrabold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60";

const fieldClassName =
  "h-14 w-full rounded border border-historine-border bg-[#151515] px-4 text-historine-text outline-none transition placeholder:text-historine-muted/70 focus:border-historine-main disabled:cursor-not-allowed disabled:opacity-60";
