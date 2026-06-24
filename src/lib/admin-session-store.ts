import { randomBytes, timingSafeEqual } from "crypto";

type AdminSession = {
  expiresAt: number;
};

const SESSION_TTL_MS = 60 * 60 * 6 * 1000;

const globalForAdminSessions = globalThis as unknown as {
  adminSessionStore?: Map<string, AdminSession>;
};

const adminSessionStore = globalForAdminSessions.adminSessionStore ?? new Map<string, AdminSession>();

if (process.env.NODE_ENV !== "production") {
  globalForAdminSessions.adminSessionStore = adminSessionStore;
}

function createSessionId() {
  return randomBytes(32).toString("base64url");
}

function isExpired(session: AdminSession) {
  return session.expiresAt <= Date.now();
}

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

export function createAdminSessionId() {
  const sessionId = createSessionId();

  adminSessionStore.set(sessionId, {
    expiresAt: Date.now() + SESSION_TTL_MS
  });

  return sessionId;
}

export function validateAdminSessionId(sessionId: string | undefined) {
  if (!sessionId) {
    return false;
  }

  for (const [storedSessionId, session] of adminSessionStore) {
    if (isExpired(session)) {
      adminSessionStore.delete(storedSessionId);
      continue;
    }

    if (safeEqual(sessionId, storedSessionId)) {
      return true;
    }
  }

  return false;
}

export function deleteAdminSessionId(sessionId: string | undefined) {
  if (!sessionId) {
    return;
  }

  adminSessionStore.delete(sessionId);
}
