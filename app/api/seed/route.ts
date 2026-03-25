import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminSecret, isAuthenticated } from "@/lib/auth";
import { runPortfolioSeed } from "@/lib/seed";

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

  try {
    const result = await runPortfolioSeed();

    return NextResponse.json(
      {
        ...result,
        message: "Seed job completed.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seed job failed", error);

    return NextResponse.json(
      {
        success: false,
        message: "Seed job failed.",
      },
      { status: 500 }
    );
  }
}
