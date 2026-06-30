import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isAdminApiEnabled } from "@/lib/admin-config";
import { validateCsrfToken } from "@/lib/csrf";
import type { ApiResponse } from "@/types/api/common";

export type AdminRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type RouteHandler<TContext> = (
  request: Request,
  context: TContext
) => Promise<Response> | Response;

type BasicRouteHandler = (request: Request) => Promise<Response> | Response;

type JsonRouteHandler<TBody, TContext> = (
  body: TBody,
  request: Request,
  context: TContext
) => Promise<Response> | Response;

type BasicJsonRouteHandler<TBody> = (
  body: TBody,
  request: Request
) => Promise<Response> | Response;

export type ValidationResult<TBody> =
  | {
      success: true;
      data: TBody;
    }
  | {
      success: false;
      error: string;
    };

export function successResponse<TData>(data: TData, status = 200) {
  return NextResponse.json<ApiResponse<TData>>(
    { success: true, data, error: null },
    { status }
  );
}

export function errorResponse(error: string, status: number) {
  return NextResponse.json<ApiResponse<null>>(
    { success: false, data: null, error },
    { status }
  );
}

export function withAdminAuth(handler: BasicRouteHandler): (request: Request) => Promise<Response>;
export function withAdminAuth<TContext>(
  handler: RouteHandler<TContext>
): (request: Request, context: TContext) => Promise<Response>;
export function withAdminAuth<TContext>(handler: BasicRouteHandler | RouteHandler<TContext>) {
  return async function adminRoute(request: Request, context?: TContext) {
    if (!isAdminApiEnabled()) {
      return errorResponse("관리자 API가 비활성화되어 있습니다.", 404);
    }

    if (!(await isAdminAuthenticated())) {
      return errorResponse("관리자 인증이 필요합니다.", 401);
    }

    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method) && !(await validateCsrfToken(request))) {
      return errorResponse("요청 검증에 실패했습니다.", 403);
    }

    return (handler as RouteHandler<TContext>)(request, context as TContext);
  };
}

export function withAdminJson<TBody>(
  validate: (body: unknown) => ValidationResult<TBody>,
  handler: BasicJsonRouteHandler<TBody>
): (request: Request) => Promise<Response>;
export function withAdminJson<TBody, TContext>(
  validate: (body: unknown) => ValidationResult<TBody>,
  handler: JsonRouteHandler<TBody, TContext>
): (request: Request, context: TContext) => Promise<Response>;
export function withAdminJson<TBody, TContext>(
  validate: (body: unknown) => ValidationResult<TBody>,
  handler: BasicJsonRouteHandler<TBody> | JsonRouteHandler<TBody, TContext>
) {
  return withAdminAuth<TContext>(async (request, context) => {
    const body = await request.json().catch(() => null);
    const validation = validate(body);

    if (!validation.success) {
      return errorResponse(validation.error, 400);
    }

    return (handler as JsonRouteHandler<TBody, TContext>)(
      validation.data,
      request,
      context
    );
  });
}
