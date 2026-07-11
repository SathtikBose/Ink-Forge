import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getSession, login } from '@/lib/auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, image, currentPassword, newPassword } = await req.json();

    if (!name && !image && !newPassword) {
      return NextResponse.json({ error: 'No data provided to update' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(session._id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) user.name = name;
    if (image !== undefined) user.image = image;

    await user.save();

    // Update the session cookie with the new info
    await login({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      image: user.image,
    });

    return NextResponse.json({ success: true, user: { name: user.name, image: user.image } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
