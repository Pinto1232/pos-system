'use server';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '../../cache-constants';

export async function POST(request: NextRequest) {
  try {
    const { secret, path, tag } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (path) {
      revalidatePath(path);
    }

    if (tag) {
      const isValidTag = Object.values(CACHE_TAGS).includes(tag);
      if (!isValidTag) {
        console.warn(`Revalidation attempted with unknown tag: ${tag}`);
      }
      revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path: path || null,
      tag: tag || null,
      availableTags: Object.values(CACHE_TAGS),
    });
  } catch (error) {
    console.error('Error during revalidation:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    availableTags: Object.entries(CACHE_TAGS).map(([key, value]) => ({
      key,
      value,
    })),
  });
}
