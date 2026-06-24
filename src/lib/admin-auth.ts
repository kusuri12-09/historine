import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import {
  createAdminSessionId,
  deleteAdminSessionId,
  validateAdminSessionId
} from "@/lib/admin-session-store";
import { clearCsrfToken, createCsrfToken, setCsrfToken } from "@/lib/csrf";

const COOKIE_NAME = "historine_admin";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return validateAdminSessionId(cookieStore.get(COOKIE_NAME)?.value);
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const sessionId = createAdminSessionId();
  const csrfToken = createCsrfToken();

  cookieStore.set(COOKIE_NAME, sessionId, {
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
  deleteAdminSessionId(cookieStore.get(COOKIE_NAME)?.value);
  cookieStore.delete(COOKIE_NAME);
  await clearCsrfToken();
}

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

function adminPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH ?? hashPassword(process.env.ADMIN_PASSWORD ?? "change-me");
}

export function validateAdminCredentials(username: string, passwordHash: string) {
  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";

  return username === adminUsername && safeEqual(passwordHash, adminPasswordHash());
}
