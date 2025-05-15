'use server';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '../../cache-constants';

export async function POST(request: NextRequest) {
  try {
    const { secret, path, tag } = await request.json();

    // Check for a valid secret to prevent unauthorized revalidations
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate the specified path or tag
    if (path) {
      revalidatePath(path);
    }

    if (tag) {
      // Validate that the tag is one of our defined cache tags
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
      availableTags: Object.values(CACHE_TAGS)
    });
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json({
      message: 'Error revalidating',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

/**
 * GET handler to retrieve available cache tags
 * This can be used by admin tools to show available tags for revalidation
 */
export async function GET(request: NextRequest) {
  // Check for a valid secret to prevent unauthorized access
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    availableTags: Object.entries(CACHE_TAGS).map(([key, value]) => ({
      key,
      value
    }))
  });
}
