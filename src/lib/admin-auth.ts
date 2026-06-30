import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { isAdminApiEnabled } from "@/lib/admin-config";
import { clearCsrfToken, createCsrfToken, setCsrfToken } from "@/lib/csrf";

const COOKIE_NAME = "historine_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 6;

type AdminSessionPayload = {
  exp: number;
  nonce: string;
};

export async function isAdminAuthenticated() {
  if (!isAdminApiEnabled()) {
    return false;
  }

  const cookieStore = await cookies();

  return validateSessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function createAdminSession() {
  if (!isAdminApiEnabled()) {
    return;
  }

  const cookieStore = await cookies();
  const csrfToken = createCsrfToken();

  cookieStore.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
  await setCsrfToken(csrfToken);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
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

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? adminPasswordHash();
}

function signPayload(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function encodePayload(payload: AdminSessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string): AdminSessionPayload | null {
  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<AdminSessionPayload>;

    if (typeof payload.exp !== "number" || typeof payload.nonce !== "string") {
      return null;
    }

    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

function createSessionToken() {
  const payload = encodePayload({
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    nonce: randomBytes(16).toString("base64url")
  });

  return `${payload}.${signPayload(payload)}`;
}

function validateSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || !safeEqual(signature, signPayload(payload))) {
    return false;
  }

  const decodedPayload = decodePayload(payload);

  return Boolean(decodedPayload && decodedPayload.exp > Math.floor(Date.now() / 1000));
}

export function validateAdminCredentials(username: string, passwordHash: string) {
  if (!isAdminApiEnabled()) {
    return false;
  }

  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";

  return username === adminUsername && safeEqual(passwordHash, adminPasswordHash());
}
