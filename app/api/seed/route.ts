import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminSecret, isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

function authorizeSeedRequest(req: NextRequest) {
  const suppliedSecret = req.headers.get("x-admin-secret");
  return isAuthenticated(req) || authenticateAdminSecret(suppliedSecret);
}

export async function POST(req: NextRequest) {
  if (!authorizeSeedRequest(req)) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authorized to run the seed job.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Seeded portfolio data has been removed. Populate content through MongoDB or the admin panel instead.",
    },
    { status: 410 }
  );
}
