"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { csrfHeader } from "@/lib/client-csrf";
import type { ApiResponse } from "@/types/api/common";
import type { TimelineResponseData } from "@/types/api/timeline";

type Message = {
  type: "success" | "error";
  text: string;
};

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

export function TimelineItemControls({ item }: { item: TimelineResponseData }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState<"delete" | "update" | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  async function handleDelete() {
    if (pending) {
      return;
    }

    setPending("delete");

    try {
      await requestJson(`/api/admin/timelines/${item.id}`, "DELETE");
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "연표 삭제에 실패했습니다."
      });
    } finally {
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
    setMessage({ type: "success", text: "연표 수정 요청을 처리하고 있습니다." });

    try {
      await requestJson(`/api/admin/timelines/${item.id}`, "PUT", {
        year: Number(formData.get("year")),
        type: formData.get("type"),
        content: formData.get("content")
      });
      setMessage({ type: "success", text: "연표가 반영되었습니다." });
      setEditing(false);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "연표 수정에 실패했습니다."
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <div className="flex gap-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
        <button className={outlineButtonClassName} onClick={() => setEditing(true)} type="button">
          수정
        </button>
        <button
          className={dangerButtonClassName}
          disabled={pending === "delete"}
          onClick={handleDelete}
          type="button"
        >
          {pending === "delete" ? "삭제 중" : "삭제"}
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
          <div className="w-full max-w-[640px] rounded-lg border border-historine-border bg-historine-panel p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[24px] font-extrabold text-historine-text">연표 수정</h2>
                <p className="mt-2 text-[15px] leading-6 text-historine-muted">
                  선택한 연표 항목의 연도, 타입, 내용을 수정합니다.
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
              <label className="grid gap-2 text-sm font-bold text-historine-muted">
                연도
                <input
                  className={fieldClassName}
                  defaultValue={item.year}
                  disabled={pending === "update"}
                  name="year"
                  required
                  type="number"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-historine-muted">
                타입
                <select
                  className={fieldClassName}
                  defaultValue={item.type}
                  disabled={pending === "update"}
                  name="type"
                  required
                >
                  <option value="KOREA">KOREA</option>
                  <option value="WORLD">WORLD</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-historine-muted md:col-span-2">
                내용
                <textarea
                  className={`${fieldClassName} min-h-28 resize-y py-3`}
                  defaultValue={item.content}
                  disabled={pending === "update"}
                  name="content"
                  required
                  rows={4}
                />
              </label>
              <button
                className={`${buttonClassName} md:w-fit disabled:cursor-not-allowed disabled:opacity-60`}
                disabled={pending === "update"}
                type="submit"
              >
                {pending === "update" ? "수정 중" : "연표 수정"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
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
