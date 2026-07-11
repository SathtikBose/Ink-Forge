import { logout } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
