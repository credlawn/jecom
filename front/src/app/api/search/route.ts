import { NextResponse } from 'next/server';
import { api } from '@/lib/fetch';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json([]); // Return empty array if no query
    }

    // Call the Frappe API endpoint
    const response = await api(`product_search.search_products?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
        // Log the error and return an empty array to the client
        const errorData = await response.text();
        console.error('[API /search] Frappe API Error:', errorData);
        return NextResponse.json([]);
    }

    const data = await response.json();
    const searchResults = data.message || [];

    return NextResponse.json(searchResults);

  } catch (error) {
    console.error('[API /search] Internal Server Error:', error);
    // Return empty array on internal server error
    return NextResponse.json([], { status: 500 });
  }
}
