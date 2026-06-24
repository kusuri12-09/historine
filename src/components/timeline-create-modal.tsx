"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { csrfHeader } from "@/lib/client-csrf";
import type { ApiResponse } from "@/types/api/common";

type Message = {
  type: "success" | "error";
  text: string;
};

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...csrfHeader()
    },
    body: JSON.stringify(body)
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "요청 처리에 실패했습니다.");
  }

  return payload;
}

export function TimelineCreateModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);
    setMessage({ type: "success", text: "연표 추가 요청을 처리하고 있습니다." });

    try {
      await postJson("/api/admin/timelines", {
        year: Number(formData.get("year")),
        type: formData.get("type"),
        content: formData.get("content")
      });
      form.reset();
      setMessage({ type: "success", text: "연표가 반영되었습니다." });
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "연표 추가에 실패했습니다."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className={buttonClassName} onClick={() => setOpen(true)} type="button">
        연표 추가
      </button>

      {open ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 py-8"
          role="dialog"
        >
          <div className="w-full max-w-[640px] rounded-lg border border-historine-border bg-historine-panel p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[24px] font-extrabold text-historine-text">연표 추가</h2>
                <p className="mt-2 text-[15px] leading-6 text-historine-muted">
                  연도, 타입, 내용을 입력해 연표 항목을 추가합니다.
                </p>
              </div>
              <button
                aria-label="닫기"
                className="rounded border border-historine-border px-3 py-2 text-sm font-bold text-historine-muted transition hover:border-historine-main hover:text-historine-main"
                disabled={submitting}
                onClick={() => setOpen(false)}
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
                  disabled={submitting}
                  name="year"
                  required
                  type="number"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-historine-muted">
                타입
                <select className={fieldClassName} disabled={submitting} name="type" required>
                  <option value="KOREA">KOREA</option>
                  <option value="WORLD">WORLD</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-historine-muted md:col-span-2">
                내용
                <textarea
                  className={`${fieldClassName} min-h-28 resize-y py-3`}
                  disabled={submitting}
                  name="content"
                  required
                  rows={4}
                />
              </label>
              <button
                className={`${buttonClassName} md:w-fit disabled:cursor-not-allowed disabled:opacity-60`}
                disabled={submitting}
                type="submit"
              >
                {submitting ? "추가 중" : "연표 추가"}
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

const fieldClassName =
  "h-14 w-full rounded border border-historine-border bg-[#151515] px-4 text-historine-text outline-none transition placeholder:text-historine-muted/70 focus:border-historine-main disabled:cursor-not-allowed disabled:opacity-60";
