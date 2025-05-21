import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, content, keys } = body;

    if (!language || !content || !keys || !Array.isArray(keys)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!['en', 'pt', 'es', 'fr'].includes(language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    const filePath = path.join(
      process.cwd(),
      'public',
      'locales',
      language,
      'common.json'
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Translations not found' },
        { status: 404 }
      );
    }

    const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const translatedContent = { ...content };

    keys.forEach((key: string) => {
      if (typeof translatedContent[key] === 'string') {
        const originalValue = translatedContent[key] as string;

        if (originalValue.includes('.')) {
          const keyParts = originalValue.split('.');

          let translation = translations;
          for (const part of keyParts) {
            if (translation && translation[part]) {
              translation = translation[part];
            } else {
              translation = null;
              break;
            }
          }

          if (translation && typeof translation === 'string') {
            translatedContent[key] = translation;
          }
        }
      } else if (Array.isArray(translatedContent[key])) {
        translatedContent[key] = (translatedContent[key] as any[]).map(
          (item) => {
            if (typeof item === 'string' && item.includes('.')) {
              const keyParts = item.split('.');

              let translation = translations;
              for (const part of keyParts) {
                if (translation && translation[part]) {
                  translation = translation[part];
                } else {
                  translation = null;
                  break;
                }
              }

              if (translation && typeof translation === 'string') {
                return translation;
              }
            }
            return item;
          }
        );
      }
    });

    return NextResponse.json(translatedContent);
  } catch (error) {
    console.error('Error translating dynamic content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
