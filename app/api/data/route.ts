import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { DATA_REVALIDATE_SECONDS, collectionSchema, getData } from '@/lib/data';

export const revalidate = DATA_REVALIDATE_SECONDS;

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

    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          'Cache-Control': `s-maxage=${DATA_REVALIDATE_SECONDS}, stale-while-revalidate=${DATA_REVALIDATE_SECONDS}`,
        },
      },
    );
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
