import { NextResponse } from "next/server";
import { getContentDocumentById, resolveContentCollection } from "@/lib/content-service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const { collection, id } = await params;
  const resolvedCollection = resolveContentCollection(collection);

  if (!resolvedCollection) {
    return NextResponse.json({ success: false, message: "Unsupported content collection." }, { status: 400 });
  }

  try {
    const data = await getContentDocumentById(resolvedCollection, id);

    if (!data) {
      return NextResponse.json({ success: false, message: "Content item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch content item.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
