import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  const expectedSecret = process.env.NEXT_REVALIDATE_SECRET;

  if (!expectedSecret) {
    console.error('Revalidate API: NEXT_REVALIDATE_SECRET is not set.');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  if (secret !== expectedSecret) {
    console.warn('Revalidate API: Unauthorized attempt with invalid secret.');
    return NextResponse.json({ message: 'Invalid secret token' }, { status: 401 });
  }

  try {
    const payload = await request.json();

    const tagsToRevalidate: string[] = [];

  
    if (payload.id === 'Hero Section') {
      tagsToRevalidate.push('hero-data');
    }
    if (payload.id === 'My Menu') {
      tagsToRevalidate.push('navbar-data');
    }
    
    if (payload.id === 'Site Settings') {
      tagsToRevalidate.push('site-settings');
    }

    if (payload.id === 'Category') {
      tagsToRevalidate.push('category-data');
    }

    if (tagsToRevalidate.length === 0) {
      return NextResponse.json({ message: 'No matching tags to revalidate for this payload' }, { status: 200 });
    }

    for (const tag of tagsToRevalidate) {
      revalidateTag(tag);
    }

    return NextResponse.json({ revalidated: true, tags: tagsToRevalidate, now: Date.now() });

  } catch (err) {
    console.error('Revalidate API: Error during processing:', err);
    return NextResponse.json({ message: 'Internal server error during revalidation', error: String(err) }, { status: 500 });
  }
}
