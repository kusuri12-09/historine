"use client";

import Link from "next/link";
import Chip from "@mui/material/Chip";

type HistoricalCardProps = {
  href: string;
  title: string;
  period: string;
  category: string;
  content: string;
  tags: string[];
  tone?: "main" | "side";
};

export function HistoricalCard({
  href,
  title,
  period,
  category,
  content,
  tags,
  tone = "main"
}: HistoricalCardProps) {
  const toneClass = tone === "main" ? "border-t-historine-main" : "border-t-historine-side";
  const hoverClass = tone === "main" ? "hover:border-historine-main/70" : "hover:border-historine-side/70";
  const chipColor = tone === "main" ? "#7298C7" : "#F4D990";

  return (
    <Link
      className={`block min-h-[254px] rounded-lg border border-historine-border border-t-4 ${toneClass} bg-historine-panel p-6 transition hover:-translate-y-1 ${hoverClass}`}
      href={href}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-extrabold text-historine-text">{title}</h2>
          <div className="mt-1 text-[15px] font-semibold text-historine-muted">{period}</div>
        </div>
        <Chip
          label={category}
          size="small"
          sx={{
            borderColor: `${chipColor}55`,
            color: chipColor,
            fontWeight: 700,
            backgroundColor: `${chipColor}14`
          }}
          variant="outlined"
        />
      </div>
      <p className="line-clamp-3 text-[16px] leading-8 text-historine-muted">{content}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            size="small"
            sx={{
              height: 24,
              borderRadius: "4px",
              color: "#9CA3AF",
              backgroundColor: "#2A2A2A",
              fontWeight: 700
            }}
          />
        ))}
      </div>
    </Link>
  );
}
