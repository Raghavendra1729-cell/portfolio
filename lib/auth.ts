import { NextRequest } from 'next/server';

export function isAuthenticated(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === process.env.ADMIN_SECRET;
}