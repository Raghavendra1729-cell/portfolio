import { createHmac, timingSafeEqual } from 'node:crypto';

import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

function getAdminSecret() {
  return process.env.ADMIN_SECRET ?? '';
}

function signSessionPayload(payload: string) {
  return createHmac('sha256', getAdminSecret()).update(payload).digest('hex');
}

function verifySignature(payload: string, signature: string) {
  const expected = signSessionPayload(payload);

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function authenticateAdminSecret(secret: string): boolean {
  return Boolean(secret) && secret === getAdminSecret();
}

export function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  const signature = signSessionPayload(payload);

  return `${payload}.${signature}`;
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  return response;
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}

function hasValidAdminSession(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const [payload, signature] = token.split('.');
  if (!payload || !signature || !verifySignature(payload, signature)) {
    return false;
  }

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Math.floor(Date.now() / 1000);
}

export function isAuthenticated(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');

  if (secret) {
    return authenticateAdminSecret(secret);
  }

  return hasValidAdminSession(req);
}
