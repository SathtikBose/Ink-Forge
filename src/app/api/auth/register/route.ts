import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Ink Forge <onboarding@resend.dev>',
          to: email,
          subject: 'Welcome to Ink Forge!',
          html: `<p>Hi ${name},</p><p>Welcome to Ink Forge. Start exploring amazing content today!</p>`,
        });
      } catch (e) {
        console.error("Failed to send welcome email", e);
      }
    }

    await login({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({ success: true, message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
