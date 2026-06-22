"use client";

import Link from "next/link";
import Button from "@mui/material/Button";

type BackButtonProps = {
  href: string;
  label: string;
};

export function BackButton({ href, label }: BackButtonProps) {
  return (
    <Button
      component={Link}
      href={href}
      sx={{
        mb: 3,
        color: "#9CA3AF",
        fontWeight: 700,
        px: 0,
        "&:hover": {
          backgroundColor: "transparent",
          color: "#E5E5E5"
        }
      }}
    >
      ← {label}
    </Button>
  );
}
