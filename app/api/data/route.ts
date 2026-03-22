import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getContentDocumentById,
  listContentDocuments,
  resolveContentCollection,
} from "@/lib/content-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { success: false, message: "Your admin session is missing or has expired. Please sign in again." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const collection = resolveContentCollection(searchParams.get("collection"));
  const id = searchParams.get("id");

  if (!collection) {
    return NextResponse.json({ success: false, message: "Invalid or missing collection" }, { status: 400 });
  }

  try {
    if (id) {
      const data = await getContentDocumentById(collection, id, { includeHidden: true });

      if (!data) {
        return NextResponse.json({ success: false, message: "Content item not found." }, { status: 404 });
      }

      return NextResponse.json({ success: true, data });
    }

    const data = await listContentDocuments(collection, { includeHidden: true });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch data.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
