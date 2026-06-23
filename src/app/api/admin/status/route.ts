import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import type { AdminStatusResponse } from "@/types/api/admin/status";

export async function GET() {
  const authenticated = await isAdminAuthenticated();

  return NextResponse.json<AdminStatusResponse>({
    success: true,
    data: { authenticated },
    error: null
  });
}
