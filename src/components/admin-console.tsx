"use client";

import { FormEvent, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

type AdminConsoleProps = {
  initialAuthenticated: boolean;
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const payload = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? "요청 처리에 실패했습니다.");
  }

  return payload;
}

export function AdminConsole({ initialAuthenticated }: AdminConsoleProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [message, setMessage] = useState<Message | null>(null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await postJson("/api/admin/auth/login", {
        username: formData.get("username"),
        password: formData.get("password")
      });
      setAuthenticated(true);
      setMessage({ type: "success", text: "관리자로 로그인되었습니다." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "로그인 실패" });
    }
  }

  async function handleLogout() {
    await postJson("/api/admin/auth/logout", {});
    setAuthenticated(false);
    setMessage({ type: "success", text: "로그아웃되었습니다." });
  }

  async function handleTimelineSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await postJson("/api/admin/timelines", {
        year: Number(formData.get("year")),
        type: formData.get("type"),
        title: formData.get("title"),
        content: formData.get("content")
      });
      form.reset();
      setMessage({ type: "success", text: "연표를 추가했습니다. 페이지를 새로고침하면 반영됩니다." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "연표 추가 실패" });
    }
  }

  async function handleEncyclopediaSubmit(event: FormEvent<HTMLFormElement>, kind: "persons" | "events") {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

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
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "백과 카드 추가 실패"
      });
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
          <AdminTextField label="아이디" name="username" required />
          <AdminTextField label="비밀번호" name="password" required type="password" />
          <Button sx={buttonSx} type="submit" variant="contained">
            로그인
          </Button>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-end">
            <Button onClick={handleLogout} sx={outlineButtonSx} variant="outlined">
              로그아웃
            </Button>
          </div>

          <AdminSection title="연표 추가">
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleTimelineSubmit}>
              <AdminTextField label="연도" name="year" required type="number" />
              <label className="grid gap-2 text-sm font-bold text-historine-muted">
                타입
                <select
                  className="h-14 rounded border border-historine-border bg-[#151515] px-4 text-historine-text outline-none focus:border-historine-main"
                  name="type"
                  required
                >
                  <option value="KOREA">KOREA</option>
                  <option value="WORLD">WORLD</option>
                </select>
              </label>
              <div className="md:col-span-2">
                <AdminTextField label="제목" name="title" required />
              </div>
              <div className="md:col-span-2">
                <AdminTextField label="내용" multiline name="content" required rows={4} />
              </div>
              <Button sx={buttonSx} type="submit" variant="contained">
                연표 추가
              </Button>
            </form>
          </AdminSection>

          <AdminSection title="인물 백과 카드 추가">
            <EncyclopediaForm buttonLabel="인물 추가" onSubmit={(event) => handleEncyclopediaSubmit(event, "persons")} />
          </AdminSection>

          <AdminSection title="사건 백과 카드 추가">
            <EncyclopediaForm buttonLabel="사건 추가" onSubmit={(event) => handleEncyclopediaSubmit(event, "events")} />
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
  onSubmit
}: {
  buttonLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      <AdminTextField label="제목" name="title" required />
      <AdminTextField label="기간" name="period" required />
      <AdminTextField label="분류" name="category" required />
      <AdminTextField label="태그" name="tags" placeholder="쉼표로 구분" />
      <div className="md:col-span-2">
        <AdminTextField label="한줄 소개" name="summary" required />
      </div>
      <div className="md:col-span-2">
        <AdminTextField label="상세 내용" multiline name="content" required rows={4} />
      </div>
      <Button sx={buttonSx} type="submit" variant="contained">
        {buttonLabel}
      </Button>
    </form>
  );
}

function AdminTextField(props: React.ComponentProps<typeof TextField>) {
  return (
    <TextField
      {...props}
      fullWidth
      sx={{
        "& .MuiInputBase-root": {
          backgroundColor: "#151515",
          color: "#E5E5E5"
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#303030"
        },
        "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#7298C7"
        },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#7298C7"
        },
        "& .MuiInputLabel-root": {
          color: "#9CA3AF"
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#7298C7"
        },
        ...props.sx
      }}
    />
  );
}

const buttonSx = {
  backgroundColor: "#7298C7",
  color: "#121212",
  fontWeight: 800,
  "&:hover": {
    backgroundColor: "#8BAFDA"
  }
};

const outlineButtonSx = {
  borderColor: "#7298C7",
  color: "#7298C7",
  fontWeight: 800,
  "&:hover": {
    borderColor: "#8BAFDA",
    backgroundColor: "rgba(114, 152, 199, 0.1)"
  }
};
