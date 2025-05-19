import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    const width = 100;
    const height = 100;

    const quality = parseInt(formData.get('quality') as string) || 85;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let processedImageBuffer;
    try {
      const outputFormat = 'webp';

      processedImageBuffer = await sharp(buffer)
        .resize({
          width: 100,
          height: 100,
          fit: 'cover',
          position: 'center',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .webp({ quality })
        .toBuffer();
    } catch (sharpError) {
      console.error('Image processing error:', sharpError);
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 400 }
      );
    }

    const uniqueId = nanoid(10);
    const fileName = `product-${uniqueId}.webp`;

    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, fileName);

    await writeFile(filePath, processedImageBuffer);

    return NextResponse.json({
      success: true,
      filePath: `/${fileName}`,
      width: 100,
      height: 100,
      format: 'webp',
      size: processedImageBuffer.length,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
