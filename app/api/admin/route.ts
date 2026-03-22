import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import {
  authenticateAdminSecret,
  clearAdminSessionCookie,
  createAdminSessionToken,
  isAuthenticated,
  setAdminSessionCookie,
} from "@/lib/auth";
import { isSupportedAdminCollection, validateContentData, type AdminCollectionId } from "@/lib/content-schema";

import Skill from "@/models/Skill";
import Achievement from "@/models/Achievement";

type AdminModel = {
  create: (data: Record<string, unknown>) => Promise<unknown>;
  findByIdAndUpdate: (id: string, data: Record<string, unknown>, options: { new: boolean; runValidators: boolean }) => Promise<unknown>;
  findByIdAndDelete: (id: string) => Promise<unknown>;
};

const MODELS: Record<AdminCollectionId, AdminModel> = {
  skill: Skill,
  achievement: Achievement,
};

type AdminErrorType = "auth" | "validation" | "server";

function getModel(collection: string | null) {
  if (!isSupportedAdminCollection(collection)) {
    return null;
  }

  return MODELS[collection];
}

function errorResponse(status: number, errorType: AdminErrorType, message: string, details?: Record<string, unknown>) {
  return NextResponse.json(
    {
      success: false,
      errorType,
      message,
      ...details,
    },
    { status }
  );
}

function requireAuthenticatedSession(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return errorResponse(401, "auth", "Your admin session is missing or has expired. Please sign in again.");
  }

  return null;
}

async function parseJsonBody(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function normalizeData(data: Record<string, unknown>) {
  const clonedData = { ...data };
  delete clonedData._id;
  delete clonedData.__v;
  return clonedData;
}

function handleMutationError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ValidationError" &&
    "errors" in error
  ) {
    const validationError = error as {
      errors: Record<string, { message?: string }>;
    };

    const fieldErrors = Object.fromEntries(
      Object.entries(validationError.errors).map(([field, value]) => [field, value.message || "Invalid value"])
    );

    return errorResponse(422, "validation", "Please correct the highlighted fields and try again.", { fieldErrors });
  }

  if (typeof error === "object" && error !== null && "name" in error && error.name === "CastError") {
    return errorResponse(400, "validation", "A provided identifier or field value is invalid.");
  }

  console.error("Admin mutation failed", error);
  return errorResponse(500, "server", "The server could not save your changes. Please try again.");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("logout") === "true") {
    return clearAdminSessionCookie(
      NextResponse.json({ success: true, authenticated: false, message: "Logged out successfully." })
    );
  }

  const suppliedSecret = req.headers.get("x-admin-secret");

  if (suppliedSecret) {
    if (!authenticateAdminSecret(suppliedSecret)) {
      return clearAdminSessionCookie(errorResponse(401, "auth", "The admin secret you entered is incorrect."));
    }

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      message: "Admin session established.",
    });

    return setAdminSessionCookie(response, createAdminSessionToken());
  }

  if (!isAuthenticated(req)) {
    return clearAdminSessionCookie(errorResponse(401, "auth", "You are not currently authenticated."));
  }

  return NextResponse.json({ success: true, authenticated: true, message: "Authenticated." });
}

export async function POST(req: NextRequest) {
  const authError = requireAuthenticatedSession(req);
  if (authError) {
    return authError;
  }

  const body = await parseJsonBody(req);
  if (!body || typeof body !== "object") {
    return errorResponse(400, "validation", "The request body must be valid JSON.");
  }

  const { collection, data } = body as { collection?: string; data?: Record<string, unknown> };
  const Model = getModel(collection ?? null);

  if (!Model) {
    return errorResponse(400, "validation", "The requested collection is invalid.");
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return errorResponse(400, "validation", "A valid content payload is required.");
  }

  if (!isSupportedAdminCollection(collection)) {
    return errorResponse(400, "validation", "The requested collection is invalid.");
  }

  const validation = validateContentData(collection, data);
  if (!validation.success) {
    return errorResponse(422, "validation", "Please correct the highlighted fields and try again.", {
      fieldErrors: validation.fieldErrors,
    });
  }

  await dbConnect();

  try {
    const newItem = await Model.create(normalizeData(validation.data));
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, data: newItem, message: "Item created successfully." }, { status: 201 });
  } catch (error) {
    return handleMutationError(error);
  }
}

export async function PUT(req: NextRequest) {
  const authError = requireAuthenticatedSession(req);
  if (authError) {
    return authError;
  }

  const body = await parseJsonBody(req);
  if (!body || typeof body !== "object") {
    return errorResponse(400, "validation", "The request body must be valid JSON.");
  }

  const { collection, id, data } = body as {
    collection?: string;
    id?: string;
    data?: Record<string, unknown>;
  };

  if (!id) {
    return errorResponse(400, "validation", "An item ID is required for updates.");
  }

  const Model = getModel(collection ?? null);
  if (!Model) {
    return errorResponse(400, "validation", "The requested collection is invalid.");
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return errorResponse(400, "validation", "A valid content payload is required.");
  }

  if (!isSupportedAdminCollection(collection)) {
    return errorResponse(400, "validation", "The requested collection is invalid.");
  }

  const validation = validateContentData(collection, data);
  if (!validation.success) {
    return errorResponse(422, "validation", "Please correct the highlighted fields and try again.", {
      fieldErrors: validation.fieldErrors,
    });
  }

  await dbConnect();

  try {
    const updatedItem = await Model.findByIdAndUpdate(id, normalizeData(validation.data), {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return errorResponse(404, "validation", "The item you tried to update could not be found.");
    }

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, data: updatedItem, message: "Item updated successfully." });
  } catch (error) {
    return handleMutationError(error);
  }
}

export async function DELETE(req: NextRequest) {
  const authError = requireAuthenticatedSession(req);
  if (authError) {
    return authError;
  }

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection");
  const id = searchParams.get("id");

  if (!id) {
    return errorResponse(400, "validation", "An item ID is required for deletion.");
  }

  const Model = getModel(collection);
  if (!Model) {
    return errorResponse(400, "validation", "The requested collection is invalid.");
  }

  await dbConnect();

  try {
    const deletedItem = await Model.findByIdAndDelete(id);

    if (!deletedItem) {
      return errorResponse(404, "validation", "The item you tried to delete could not be found.");
    }

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, message: "Deleted successfully." });
  } catch (error) {
    return handleMutationError(error);
  }
}
