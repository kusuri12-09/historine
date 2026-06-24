import { NextResponse } from "next/server";
import { createAdminSession, validateAdminCredentials } from "@/lib/admin-auth";
import {
  clearRateLimit,
  getClientIp,
  getRateLimitStatus,
  recordRateLimitAttempt
} from "@/lib/rate-limit";
import type { AdminLoginRequest, AdminLoginResponse } from "@/types/api/auth/login";

const LOGIN_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_RATE_LIMIT_OPTIONS = {
  limit: 5,
  windowMs: LOGIN_RATE_LIMIT_WINDOW_MS
};

const LOGIN_IP_RATE_LIMIT_OPTIONS = {
  limit: 20,
  windowMs: LOGIN_RATE_LIMIT_WINDOW_MS
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<AdminLoginRequest> | null;

  if (!body?.username || !body?.passwordHash) {
    return NextResponse.json<AdminLoginResponse>(
      { success: false, data: null, error: "로그인 정보를 확인해주세요." },
      { status: 400 }
    );
  }

  const clientIp = getClientIp(request);
  const normalizedUsername = body.username.trim().toLowerCase();
  const usernameLimitKey = `admin-login:${clientIp}:${normalizedUsername}`;
  const ipLimitKey = `admin-login:${clientIp}`;
  const usernameLimit = getRateLimitStatus(usernameLimitKey, LOGIN_RATE_LIMIT_OPTIONS);
  const ipLimit = getRateLimitStatus(ipLimitKey, LOGIN_IP_RATE_LIMIT_OPTIONS);

  if (usernameLimit.limited || ipLimit.limited) {
    const retryAfter = Math.max(usernameLimit.retryAfter, ipLimit.retryAfter);

    return NextResponse.json<AdminLoginResponse>(
      { success: false, data: null, error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter)
        }
      }
    );
  }

  if (!validateAdminCredentials(body.username, body.passwordHash)) {
    recordRateLimitAttempt(usernameLimitKey, LOGIN_RATE_LIMIT_OPTIONS);
    recordRateLimitAttempt(ipLimitKey, LOGIN_IP_RATE_LIMIT_OPTIONS);

    return NextResponse.json<AdminLoginResponse>(
      { success: false, data: null, error: "로그인에 실패했습니다." },
      { status: 401 }
    );
  }

  clearRateLimit(usernameLimitKey);
  clearRateLimit(ipLimitKey);

  await createAdminSession();

  return NextResponse.json<AdminLoginResponse>({
    success: true,
    data: { message: "로그인되었습니다." },
    error: null
  });
}
