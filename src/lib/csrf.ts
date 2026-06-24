import { randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const CSRF_COOKIE_NAME = "historine_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";

export function createCsrfToken() {
  return randomBytes(32).toString("base64url");
}

export async function setCsrfToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 6
  });
}

export async function clearCsrfToken() {
  const cookieStore = await cookies();
  cookieStore.delete(CSRF_COOKIE_NAME);
}

export async function validateCsrfToken(request: Request) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  const cookieTokenBuffer = Buffer.from(cookieToken);
  const headerTokenBuffer = Buffer.from(headerToken);

  if (cookieTokenBuffer.length !== headerTokenBuffer.length) {
    return false;
  }

  return timingSafeEqual(cookieTokenBuffer, headerTokenBuffer);
}
