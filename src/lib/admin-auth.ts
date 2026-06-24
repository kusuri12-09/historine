import { cookies } from "next/headers";
import { clearCsrfToken, createCsrfToken, setCsrfToken } from "@/lib/csrf";

const COOKIE_NAME = "historine_admin";

function sessionValue() {
  return process.env.ADMIN_SESSION_SECRET ?? "local-dev-admin-session";
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === sessionValue();
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const csrfToken = createCsrfToken();

  cookieStore.set(COOKIE_NAME, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 6
  });
  await setCsrfToken(csrfToken);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  await clearCsrfToken();
}

export function validateAdminCredentials(username: string, password: string) {
  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me";

  return username === adminUsername && password === adminPassword;
}
