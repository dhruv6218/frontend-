import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const res = await fetch('http://localhost:8001/api/verify/aadhaar/submit-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit OTP' }, { status: 500 });
  }
}
