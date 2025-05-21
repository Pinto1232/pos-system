import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'en';
    const namespace = searchParams.get('namespace') || 'common';

    if (!['en', 'pt', 'es', 'fr'].includes(language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    if (!['common'].includes(namespace)) {
      return NextResponse.json({ error: 'Invalid namespace' }, { status: 400 });
    }

    const filePath = path.join(
      process.cwd(),
      'public',
      'locales',
      language,
      `${namespace}.json`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Translations not found' },
        { status: 404 }
      );
    }

    const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    return NextResponse.json(translations, {
      headers: {
        'Cache-Control':
          'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
