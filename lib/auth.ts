import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

type AdminTokenPayload = {
  sub: "admin";
  iat: number;
  exp: number;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4 || 4)) % 4;
  return Buffer.from(`${normalized}${"=".repeat(padding)}`, "base64").toString("utf8");
}

function getAdminSecret() {
  return process.env.ADMIN_SECRET ?? "";
}

function getJwtSigningSecret() {
  return process.env.ADMIN_JWT_SECRET || getAdminSecret();
}

function createSignature(input: string) {
  return createHmac("sha256", getJwtSigningSecret()).update(input).digest("base64url");
}

export function authenticateAdminSecret(secret: string | null) {
  const expected = getAdminSecret();

  if (!secret || !expected) {
    return false;
  }

  const suppliedBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expected);

  if (suppliedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export function createAdminSessionToken() {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: AdminTokenPayload = {
    sub: "admin",
    iat: issuedAt,
    exp: issuedAt + ADMIN_SESSION_TTL_SECONDS,
  };

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = createSignature(`${header}.${body}`);

  return `${header}.${body}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    return null;
  }

  const expectedSignature = createSignature(`${header}.${payload}`);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(base64UrlDecode(payload)) as AdminTokenPayload;

    if (decodedPayload.sub !== "admin") {
      return null;
    }

    if (decodedPayload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decodedPayload;
  } catch {
    return null;
  }
}

export function getAdminTokenFromRequest(req: NextRequest) {
  return req.cookies.get(ADMIN_COOKIE_NAME)?.value;
}

export function isAuthenticated(req: NextRequest) {
  return Boolean(verifyAdminSessionToken(getAdminTokenFromRequest(req)));
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  return response;
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
