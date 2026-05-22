import { NextRequest, NextResponse } from 'next/server';

const MANGADEX_API_URL = 'https://api.mangadex.org';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const { searchParams } = new URL(request.url);
  
  const targetUrl = `${MANGADEX_API_URL}/${path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'InkdropMangaReader/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('MangaDex Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from MangaDex' }, { status: 500 });
  }
}
