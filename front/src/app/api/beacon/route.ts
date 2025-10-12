import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    await axiosInstance.get("/api/method/myecom.api.visitors_record.update_session_time", {
      params: payload,
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error("[Beacon API] Error:", error);
    return new Response('Error processing beacon data', {
      status: 500,
    });
  }
}
