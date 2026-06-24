"use client";

export function getCsrfToken() {
  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("historine_csrf="))
      ?.split("=")[1] ?? ""
  );
}

export function csrfHeader() {
  return {
    "x-csrf-token": decodeURIComponent(getCsrfToken())
  };
}
