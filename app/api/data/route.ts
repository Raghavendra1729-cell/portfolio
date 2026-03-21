import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { collectionSchema, getData } from '@/lib/data';

const querySchema = z.object({
  collection: collectionSchema,
});

export async function GET(req: NextRequest) {
  const parsedQuery = querySchema.safeParse({
    collection: req.nextUrl.searchParams.get('collection')?.trim().toLowerCase(),
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid or missing collection query parameter.',
        issues: parsedQuery.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const data = await getData(parsedQuery.data.collection);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load collection data.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    );
  }
}
