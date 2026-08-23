"use client";

import { LoadingSpinner } from "@/components/loading-spinner";

export function DeleteConfirmModal({
  ids,
  label,
  pending,
  onCancel,
  onConfirm
}: {
  ids: number[];
  label: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div aria-modal="true" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5 py-8" role="dialog">
      <div className="w-full max-w-[520px] rounded-lg border border-historine-border bg-historine-panel p-6 shadow-2xl">
        <h2 className="text-[24px] font-extrabold text-historine-text">삭제 확인</h2>
        <p className="mt-4 leading-7 text-historine-muted">
          정말 삭제하시겠습니까? 데이터베이스에서 롤백 가능합니다. {label} id={ids.join(",")}
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            className="rounded border border-historine-main px-4 py-2 text-sm font-extrabold text-historine-main transition hover:bg-historine-main/10 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pending}
            onClick={onCancel}
            type="button"
          >
            취소
          </button>
          <button
            className="rounded bg-red-500 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pending}
            onClick={onConfirm}
            type="button"
          >
            {pending ? <LoadingSpinner label="삭제 중" /> : "삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}
