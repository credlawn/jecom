import { NextResponse } from 'next/server';
import { getFilterData } from '@/get-api-data/product';

export async function GET() {
  try {
    const filterData = await getFilterData();
    if (!filterData) {
      return NextResponse.json({ error: 'Failed to fetch filter data' }, { status: 500 });
    }
    return NextResponse.json(filterData);
  } catch (error) {
    console.error('[API /products/filter-data] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
