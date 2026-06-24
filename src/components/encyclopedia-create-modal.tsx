"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { csrfHeader } from "@/lib/client-csrf";
import type { ApiResponse } from "@/types/api/common";

type EncyclopediaKind = "persons" | "events";

type EncyclopediaCreateModalProps = {
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

export function EncyclopediaCreateModal({ kind }: EncyclopediaCreateModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const label = kind === "persons" ? "인물" : "사건";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);
    setMessage({ type: "success", text: `${label} 백과 추가 요청을 처리하고 있습니다.` });

    try {
      await postJson(`/api/admin/${kind}`, {
        title: formData.get("title"),
        period: formData.get("period"),
        category: formData.get("category"),
        tags: parseTags(formData.get("tags")),
        summary: formData.get("summary"),
        content: formData.get("content")
      });
      form.reset();
      setMessage({ type: "success", text: `${label} 백과 카드가 반영되었습니다.` });
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : `${label} 백과 추가에 실패했습니다.`
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className={buttonClassName} onClick={() => setOpen(true)} type="button">
        {label} 추가
      </button>

      {open ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 py-8"
          role="dialog"
        >
          <div className="max-h-full w-full max-w-[720px] overflow-y-auto rounded-lg border border-historine-border bg-historine-panel p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[24px] font-extrabold text-historine-text">
                  {label} 백과 카드 추가
                </h2>
                <p className="mt-2 text-[15px] leading-6 text-historine-muted">
                  제목, 기간, 분류, 요약과 상세 내용을 입력합니다.
                </p>
              </div>
              <button
                aria-label="닫기"
                className="rounded border border-historine-border px-3 py-2 text-sm font-bold text-historine-muted transition hover:border-historine-main hover:text-historine-main disabled:cursor-not-allowed disabled:opacity-60"
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
              <TextField disabled={submitting} label="제목" name="title" required />
              <TextField disabled={submitting} label="기간" name="period" required />
              <TextField disabled={submitting} label="분류" name="category" required />
              <TextField disabled={submitting} label="태그" name="tags" placeholder="쉼표로 구분" />
              <div className="md:col-span-2">
                <TextField disabled={submitting} label="한줄 소개" name="summary" required />
              </div>
              <div className="md:col-span-2">
                <TextField disabled={submitting} label="상세 내용" multiline name="content" required rows={4} />
              </div>
              <button
                className={`${buttonClassName} md:w-fit disabled:cursor-not-allowed disabled:opacity-60`}
                disabled={submitting}
                type="submit"
              >
                {submitting ? "추가 중" : `${label} 추가`}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function TextField({
  disabled,
  label,
  multiline = false,
  name,
  placeholder,
  required,
  rows
}: {
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
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          className={fieldClassName}
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

const fieldClassName =
  "h-14 w-full rounded border border-historine-border bg-[#151515] px-4 text-historine-text outline-none transition placeholder:text-historine-muted/70 focus:border-historine-main disabled:cursor-not-allowed disabled:opacity-60";
