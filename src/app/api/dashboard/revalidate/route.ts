import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { secret, path, tag } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!path && !tag) {
      revalidatePath('/dashboard');
      return NextResponse.json({
        revalidated: true,
        now: Date.now(),
        path: '/dashboard',
      });
    }

    if (path) {
      revalidatePath(path);
    }

    if (tag) {
      revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path: path || null,
      tag: tag || null,
    });
  } catch (error) {
    console.error(
      'Error during dashboard revalidation:',
      JSON.stringify(error, null, 2)
    );
    return NextResponse.json(
      {
        message: 'Error revalidating dashboard',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
