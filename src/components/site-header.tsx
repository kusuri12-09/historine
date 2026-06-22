"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

const navItems = [
  { href: "/", label: "연표" },
  { href: "/persons", label: "인물백과" },
  { href: "/events", label: "사건백과" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-historine-border bg-historine-bg/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] w-full max-w-[1220px] items-center justify-between px-5">
        <Link className="text-[22px] font-extrabold tracking-[0.22em] text-historine-text" href="/">
          HISTORINE
        </Link>

        <NavigationMenu.Root>
          <NavigationMenu.List className="flex items-center gap-2">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/" || pathname === "/timeline"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <NavigationMenu.Item key={item.href}>
                  <NavigationMenu.Link asChild active={active}>
                    <Link
                      className={[
                        "rounded px-5 py-3 text-[16px] font-bold transition",
                        active
                          ? "bg-historine-main/10 text-historine-main"
                          : "text-historine-muted hover:bg-white/5 hover:text-historine-text"
                      ].join(" ")}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              );
            })}
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </header>
  );
}
