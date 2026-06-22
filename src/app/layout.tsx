import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "HISTORINE",
  description: "대한민국 근대 국가 수립기의 연표, 인물, 사건 백과 서비스"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <SiteHeader />
        <main className="min-h-[calc(100vh-164px)]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
