"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { csrfHeader } from "@/lib/client-csrf";
import type { AdminStatusResponse } from "@/types/api/admin/status";

const navItems = [
  { href: "/", label: "연표" },
  { href: "/persons", label: "인물백과" },
  { href: "/events", label: "사건백과" }
];

export function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const refreshAdminStatus = useCallback(async () => {
    const response = await fetch("/api/admin/status", {
      cache: "no-store"
    });
    const payload = (await response.json().catch(() => null)) as AdminStatusResponse | null;

    setAuthenticated(Boolean(payload?.data?.authenticated));
  }, []);

  useEffect(() => {
    refreshAdminStatus();

    window.addEventListener("admin-auth-changed", refreshAdminStatus);
    return () => window.removeEventListener("admin-auth-changed", refreshAdminStatus);
  }, [refreshAdminStatus]);

  async function handleLogout() {
    setLoggingOut(true);

    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...csrfHeader()
      },
      body: "{}"
    });

    if (pathname.startsWith("/admin")) {
      router.push("/admin");
    }

    setAuthenticated(false);
    window.dispatchEvent(new Event("admin-auth-changed"));
    router.refresh();
    setLoggingOut(false);
  }

  return (
    <nav className="flex items-center gap-2" aria-label="주요 메뉴">
      {navItems.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/" || pathname === "/timeline"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            className={[
              "rounded px-5 py-3 text-[16px] font-bold transition",
              active
                ? "bg-historine-main/10 text-historine-main"
                : "text-historine-muted hover:bg-white/5 hover:text-historine-text"
            ].join(" ")}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}

      {authenticated ? (
        <button
          className="ml-2 rounded border border-historine-main px-4 py-2 text-[15px] font-extrabold text-historine-main transition hover:bg-historine-main/10 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loggingOut}
          onClick={handleLogout}
          type="button"
        >
          {loggingOut ? <LoadingSpinner label="로그아웃 중" /> : "로그아웃"}
        </button>
      ) : null}
    </nav>
  );
}
