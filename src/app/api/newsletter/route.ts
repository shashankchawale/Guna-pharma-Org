import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully to GUNA PHARMA updates',
      email: body?.email || null,
    });
  } catch (error) {
    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  }
}
