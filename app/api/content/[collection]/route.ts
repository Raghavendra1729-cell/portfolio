import { NextResponse } from "next/server";
import { listContentDocuments, resolveContentCollection } from "@/lib/content-service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const resolvedCollection = resolveContentCollection(collection);

  if (!resolvedCollection) {
    return NextResponse.json({ success: false, message: "Unsupported content collection." }, { status: 400 });
  }

  try {
    const data = await listContentDocuments(resolvedCollection);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch content.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
