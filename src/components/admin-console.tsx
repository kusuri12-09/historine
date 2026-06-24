"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiResponse } from "@/types/api/common";
import type { EncyclopediaResponseData } from "@/types/api/encyclopedia";
import type { TimelineResponseData } from "@/types/api/timeline";

type AdminConsoleProps = {
  initialAuthenticated: boolean;
  initialEvents: EncyclopediaResponseData[];
  initialPersons: EncyclopediaResponseData[];
  initialTimelines: TimelineResponseData[];
};

type Message = {
  type: "success" | "error";
  text: string;
};

type EditableResource = "timelines" | "persons" | "events";

type PendingAction =
  | "auth:login"
  | "timelines:create"
  | "persons:create"
  | "events:create"
  | "item:update"
  | `timelines:delete:${number}`
  | `persons:delete:${number}`
  | `events:delete:${number}`;

type EditingItem =
  | {
      kind: "timelines";
      item: TimelineResponseData;
    }
  | {
      kind: "persons" | "events";
      item: EncyclopediaResponseData;
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "요청 처리에 실패했습니다.");
  }

  return payload;
}

async function requestJson(url: string, method: "PUT" | "DELETE", body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "요청 처리에 실패했습니다.");
  }

  return payload;
}

export function AdminConsole({
  initialAuthenticated,
  initialEvents,
  initialPersons,
  initialTimelines
}: AdminConsoleProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const router = useRouter();

  useEffect(() => {
    setAuthenticated(initialAuthenticated);
  }, [initialAuthenticated]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pendingAction) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    setPendingAction("auth:login");
    setMessage({ type: "success", text: "로그인 요청을 처리하고 있습니다." });

    try {
      await postJson("/api/auth/login", {
        username: formData.get("username"),
        password: formData.get("password")
      });
      setAuthenticated(true);
      setMessage({ type: "success", text: "관리자로 로그인되었습니다." });
      window.dispatchEvent(new Event("admin-auth-changed"));
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "로그인 실패" });
    } finally {
      setPendingAction(null);
    }
  }

  async function handleTimelineSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pendingAction) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setPendingAction("timelines:create");
    setMessage({ type: "success", text: "연표 추가 요청을 처리하고 있습니다." });

    try {
      await postJson("/api/admin/timelines", {
        year: Number(formData.get("year")),
        type: formData.get("type"),
        content: formData.get("content")
      });
      form.reset();
      setMessage({ type: "success", text: "연표를 추가했습니다. 페이지를 새로고침하면 반영됩니다." });
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "연표 추가 실패" });
    } finally {
      setPendingAction(null);
    }
  }

  async function handleEncyclopediaSubmit(event: FormEvent<HTMLFormElement>, kind: "persons" | "events") {
    event.preventDefault();

    if (pendingAction) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setPendingAction(`${kind}:create`);
    setMessage({
      type: "success",
      text: `${kind === "persons" ? "인물" : "사건"} 백과 추가 요청을 처리하고 있습니다.`
    });

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
      setMessage({
        type: "success",
        text: `${kind === "persons" ? "인물" : "사건"} 백과 카드를 추가했습니다. 페이지를 새로고침하면 반영됩니다.`
      });
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "백과 카드 추가 실패"
      });
    } finally {
      setPendingAction(null);
    }
  }

  async function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingItem || pendingAction) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    setPendingAction("item:update");
    setMessage({ type: "success", text: "수정 요청을 처리하고 있습니다." });

    try {
      if (editingItem.kind === "timelines") {
        await requestJson(`/api/admin/timelines/${editingItem.item.id}`, "PUT", {
          year: Number(formData.get("year")),
          type: formData.get("type"),
          content: formData.get("content")
        });
        setMessage({ type: "success", text: "연표를 수정했습니다." });
      } else {
        await requestJson(`/api/admin/${editingItem.kind}/${editingItem.item.id}`, "PUT", {
          title: formData.get("title"),
          period: formData.get("period"),
          category: formData.get("category"),
          tags: parseTags(formData.get("tags")),
          summary: formData.get("summary"),
          content: formData.get("content")
        });
        setMessage({
          type: "success",
          text: `${editingItem.kind === "persons" ? "인물" : "사건"} 백과 카드를 수정했습니다.`
        });
      }

      setEditingItem(null);
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "수정 실패" });
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete(kind: EditableResource, id: number) {
    if (pendingAction) {
      return;
    }

    setPendingAction(`${kind}:delete:${id}`);
    setMessage({ type: "success", text: "삭제 요청을 처리하고 있습니다." });

    try {
      await requestJson(`/api/admin/${kind}/${id}`, "DELETE");
      setEditingItem((current) => (current?.kind === kind && current.item.id === id ? null : current));
      setMessage({ type: "success", text: "삭제했습니다." });
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "삭제 실패" });
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 py-20">
      <div className="mb-12">
        <div className="mb-4 text-[15px] font-bold tracking-[0.35em] text-historine-side">
          ADMIN CONSOLE
        </div>
        <h1 className="text-[42px] font-extrabold text-historine-text">관리자</h1>
        <p className="mt-3 text-[17px] text-historine-muted">
          관리자 로그인 후 연표, 인물 백과, 사건 백과 데이터를 추가합니다.
        </p>
      </div>

      {message ? (
        <div
          className={[
            "mb-8 rounded-lg border p-4 text-sm font-bold",
            message.type === "success"
              ? "border-historine-main/40 bg-historine-main/10 text-historine-main"
              : "border-red-400/40 bg-red-400/10 text-red-300"
          ].join(" ")}
        >
          {message.text}
        </div>
      ) : null}

      {!authenticated ? (
        <form
          className="grid max-w-[460px] gap-5 rounded-lg border border-historine-border bg-historine-panel p-7"
          onSubmit={handleLogin}
        >
          <AdminTextField disabled={pendingAction === "auth:login"} label="아이디" name="username" required />
          <AdminTextField disabled={pendingAction === "auth:login"} label="비밀번호" name="password" required type="password" />
          <button className={buttonClassName} disabled={pendingAction === "auth:login"} type="submit">
            {pendingAction === "auth:login" ? "로그인 중" : "로그인"}
          </button>
        </form>
      ) : (
        <div className="space-y-8">
          <AdminSection title="연표 추가">
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleTimelineSubmit}>
              <AdminTextField disabled={pendingAction === "timelines:create"} label="연도" name="year" required type="number" />
              <label className="grid gap-2 text-sm font-bold text-historine-muted">
                타입
                <select
                  className="h-14 rounded border border-historine-border bg-[#151515] px-4 text-historine-text outline-none focus:border-historine-main"
                  disabled={pendingAction === "timelines:create"}
                  name="type"
                  required
                >
                  <option value="KOREA">KOREA</option>
                  <option value="WORLD">WORLD</option>
                </select>
              </label>
              <div className="md:col-span-2">
                <AdminTextField disabled={pendingAction === "timelines:create"} label="내용" multiline name="content" required rows={4} />
              </div>
              <button className={buttonClassName} disabled={pendingAction === "timelines:create"} type="submit">
                {pendingAction === "timelines:create" ? "추가 중" : "연표 추가"}
              </button>
            </form>
          </AdminSection>

          <AdminSection title="인물 백과 카드 추가">
            <EncyclopediaForm
              buttonLabel="인물 추가"
              disabled={pendingAction === "persons:create"}
              pendingLabel="추가 중"
              onSubmit={(event) => handleEncyclopediaSubmit(event, "persons")}
            />
          </AdminSection>

          <AdminSection title="사건 백과 카드 추가">
            <EncyclopediaForm
              buttonLabel="사건 추가"
              disabled={pendingAction === "events:create"}
              pendingLabel="추가 중"
              onSubmit={(event) => handleEncyclopediaSubmit(event, "events")}
            />
          </AdminSection>

          {editingItem ? (
            <AdminSection title="선택 항목 수정">
              <EditForm
                disabled={pendingAction === "item:update"}
                editingItem={editingItem}
                onCancel={() => setEditingItem(null)}
                onSubmit={handleEditSubmit}
              />
            </AdminSection>
          ) : null}

          <AdminSection title="연표 관리">
            <TimelineAdminList
              items={initialTimelines}
              pendingAction={pendingAction}
              onDelete={(id) => handleDelete("timelines", id)}
              onEdit={(item) => setEditingItem({ kind: "timelines", item })}
            />
          </AdminSection>

          <AdminSection title="인물 백과 관리">
            <EncyclopediaAdminList
              items={initialPersons}
              kind="persons"
              pendingAction={pendingAction}
              onDelete={(id) => handleDelete("persons", id)}
              onEdit={(item) => setEditingItem({ kind: "persons", item })}
            />
          </AdminSection>

          <AdminSection title="사건 백과 관리">
            <EncyclopediaAdminList
              items={initialEvents}
              kind="events"
              pendingAction={pendingAction}
              onDelete={(id) => handleDelete("events", id)}
              onEdit={(item) => setEditingItem({ kind: "events", item })}
            />
          </AdminSection>
        </div>
      )}
    </div>
  );
}

function AdminSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-historine-border bg-historine-panel p-7">
      <h2 className="mb-6 text-[22px] font-extrabold text-historine-text">{title}</h2>
      {children}
    </section>
  );
}

function EncyclopediaForm({
  buttonLabel,
  disabled,
  pendingLabel,
  onSubmit
}: {
  buttonLabel: string;
  disabled: boolean;
  pendingLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      <AdminTextField disabled={disabled} label="제목" name="title" required />
      <AdminTextField disabled={disabled} label="기간" name="period" required />
      <AdminTextField disabled={disabled} label="분류" name="category" required />
      <AdminTextField disabled={disabled} label="태그" name="tags" placeholder="쉼표로 구분" />
      <div className="md:col-span-2">
        <AdminTextField disabled={disabled} label="한줄 소개" name="summary" required />
      </div>
      <div className="md:col-span-2">
        <AdminTextField disabled={disabled} label="상세 내용" multiline name="content" required rows={4} />
      </div>
      <button className={buttonClassName} disabled={disabled} type="submit">
        {disabled ? pendingLabel : buttonLabel}
      </button>
    </form>
  );
}

function EditForm({
  disabled,
  editingItem,
  onCancel,
  onSubmit
}: {
  disabled: boolean;
  editingItem: EditingItem;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (editingItem.kind === "timelines") {
    return (
      <form className="grid gap-4 md:grid-cols-2" key={`timeline-${editingItem.item.id}`} onSubmit={onSubmit}>
        <AdminTextField disabled={disabled} defaultValue={String(editingItem.item.year)} label="연도" name="year" required type="number" />
        <label className="grid gap-2 text-sm font-bold text-historine-muted">
          타입
          <select
            className="h-14 rounded border border-historine-border bg-[#151515] px-4 text-historine-text outline-none focus:border-historine-main"
            defaultValue={editingItem.item.type}
            disabled={disabled}
            name="type"
            required
          >
            <option value="KOREA">KOREA</option>
            <option value="WORLD">WORLD</option>
          </select>
        </label>
        <div className="md:col-span-2">
          <AdminTextField disabled={disabled} defaultValue={editingItem.item.content} label="내용" multiline name="content" required rows={4} />
        </div>
        <FormActions disabled={disabled} onCancel={onCancel} submitLabel={disabled ? "수정 중" : "연표 수정"} />
      </form>
    );
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" key={`${editingItem.kind}-${editingItem.item.id}`} onSubmit={onSubmit}>
      <AdminTextField disabled={disabled} defaultValue={editingItem.item.title} label="제목" name="title" required />
      <AdminTextField disabled={disabled} defaultValue={editingItem.item.period} label="기간" name="period" required />
      <AdminTextField disabled={disabled} defaultValue={editingItem.item.category} label="분류" name="category" required />
      <AdminTextField disabled={disabled} defaultValue={editingItem.item.tags.join(", ")} label="태그" name="tags" placeholder="쉼표로 구분" />
      <div className="md:col-span-2">
        <AdminTextField disabled={disabled} defaultValue={editingItem.item.summary} label="한줄 소개" name="summary" required />
      </div>
      <div className="md:col-span-2">
        <AdminTextField disabled={disabled} defaultValue={editingItem.item.content} label="상세 내용" multiline name="content" required rows={4} />
      </div>
      <FormActions disabled={disabled} onCancel={onCancel} submitLabel={disabled ? "수정 중" : "백과 수정"} />
    </form>
  );
}

function FormActions({
  disabled,
  onCancel,
  submitLabel
}: {
  disabled: boolean;
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex gap-3">
      <button className={buttonClassName} disabled={disabled} type="submit">
        {submitLabel}
      </button>
      <button className={outlineButtonClassName} disabled={disabled} onClick={onCancel} type="button">
        취소
      </button>
    </div>
  );
}

function TimelineAdminList({
  items,
  pendingAction,
  onDelete,
  onEdit
}: {
  items: TimelineResponseData[];
  pendingAction: PendingAction | null;
  onDelete: (id: number) => void;
  onEdit: (item: TimelineResponseData) => void;
}) {
  if (items.length === 0) {
    return <p className="text-historine-muted">등록된 연표가 없습니다.</p>;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div className="rounded border border-historine-border bg-[#151515] p-4" key={item.id}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="font-extrabold text-historine-main">
              {item.year} · {item.type}
            </div>
            <AdminItemActions
              deleteDisabled={pendingAction === `timelines:delete:${item.id}`}
              deleteLabel={pendingAction === `timelines:delete:${item.id}` ? "삭제 중" : "삭제"}
              onDelete={() => onDelete(item.id)}
              onEdit={() => onEdit(item)}
            />
          </div>
          <p className="text-[15px] leading-7 text-historine-muted">{item.content}</p>
        </div>
      ))}
    </div>
  );
}

function EncyclopediaAdminList({
  items,
  kind,
  pendingAction,
  onDelete,
  onEdit
}: {
  items: EncyclopediaResponseData[];
  kind: "persons" | "events";
  pendingAction: PendingAction | null;
  onDelete: (id: number) => void;
  onEdit: (item: EncyclopediaResponseData) => void;
}) {
  if (items.length === 0) {
    return <p className="text-historine-muted">등록된 항목이 없습니다.</p>;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div className="rounded border border-historine-border bg-[#151515] p-4" key={item.id}>
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-extrabold text-historine-text">{item.title}</div>
              <div className="mt-1 text-sm text-historine-muted">
                {item.period} · {item.category}
              </div>
            </div>
            <AdminItemActions
              deleteDisabled={pendingAction === `${kind}:delete:${item.id}`}
              deleteLabel={pendingAction === `${kind}:delete:${item.id}` ? "삭제 중" : "삭제"}
              onDelete={() => onDelete(item.id)}
              onEdit={() => onEdit(item)}
            />
          </div>
          <p className="text-[15px] leading-7 text-historine-muted">{item.summary}</p>
        </div>
      ))}
    </div>
  );
}

function AdminItemActions({
  deleteDisabled = false,
  deleteLabel = "삭제",
  onDelete,
  onEdit
}: {
  deleteDisabled?: boolean;
  deleteLabel?: string;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button className={smallOutlineButtonClassName} onClick={onEdit} type="button">
        수정
      </button>
      <button className={dangerButtonClassName} disabled={deleteDisabled} onClick={onDelete} type="button">
        {deleteLabel}
      </button>
    </div>
  );
}

type AdminTextFieldProps = {
  defaultValue?: string;
  disabled?: boolean;
  label: string;
  multiline?: boolean;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  type?: string;
};

function AdminTextField({
  defaultValue,
  disabled = false,
  label,
  multiline = false,
  name,
  placeholder,
  required,
  rows,
  type = "text"
}: AdminTextFieldProps) {
  const fieldClassName =
    "w-full rounded border border-historine-border bg-[#151515] px-4 py-3 text-historine-text outline-none transition placeholder:text-historine-muted/70 focus:border-historine-main";

  return (
    <label className="grid gap-2 text-sm font-bold text-historine-muted">
      {label}
      {multiline ? (
        <textarea
          className={`${fieldClassName} min-h-28 resize-y`}
          defaultValue={defaultValue}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          className={`${fieldClassName} h-14`}
          defaultValue={defaultValue}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
        />
      )}
    </label>
  );
}

const buttonClassName =
  "h-12 rounded bg-historine-main px-5 text-[15px] font-extrabold text-historine-bg transition hover:bg-[#8BAFDA] disabled:cursor-not-allowed disabled:opacity-60";

const outlineButtonClassName =
  "h-12 rounded border border-historine-main px-5 text-[15px] font-extrabold text-historine-main transition hover:bg-historine-main/10 disabled:cursor-not-allowed disabled:opacity-60";

const smallOutlineButtonClassName =
  "rounded border border-historine-main px-3 py-2 text-sm font-extrabold text-historine-main transition hover:bg-historine-main/10";

const dangerButtonClassName =
  "rounded border border-red-400/60 px-3 py-2 text-sm font-extrabold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60";
