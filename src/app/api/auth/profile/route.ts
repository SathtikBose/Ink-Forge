import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getSession, login } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(session._id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.name = name;
    await user.save();

    // Update the session cookie with the new name
    await login({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json({ success: true, user: { name: user.name } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
