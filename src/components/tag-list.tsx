"use client";

import Chip from "@mui/material/Chip";

type TagListProps = {
  tags: string[];
};

export function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={`#${tag}`}
          sx={{
            borderColor: "#F4D99055",
            color: "#F4D990",
            fontWeight: 800,
            backgroundColor: "#F4D99014"
          }}
          variant="outlined"
        />
      ))}
    </div>
  );
}
