import Link from "next/link";
import { HeaderNav } from "@/components/header-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-historine-border bg-historine-bg/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] w-full max-w-[1220px] items-center justify-between px-5">
        <Link className="text-[22px] font-extrabold tracking-[0.22em] text-historine-text" href="/">
          HISTORINE
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
