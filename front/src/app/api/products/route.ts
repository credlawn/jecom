import { NextResponse } from 'next/server';
import { getProductList } from '@/get-api-data/product';
import { ProductListFilters } from '@/types/product';

export async function POST(request: Request) {
  try {
    const filters: ProductListFilters = await request.json();
    const productResponse = await getProductList(filters);
    return NextResponse.json(productResponse);
  } catch (error) {
    console.error('[API /products] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
