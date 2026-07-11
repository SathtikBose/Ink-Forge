import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import { getSession } from '@/lib/auth';
import { moderateContent } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'WRITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, status } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    let finalStatus = status || 'DRAFT';
    let aiFeedback = '';

    if (finalStatus === 'PUBLISHED') {
      const moderation = await moderateContent(content, 'POST');
      if (!moderation.passed) {
        finalStatus = 'REJECTED';
        aiFeedback = moderation.feedback;
      }
    }

    await connectToDatabase();

    const post = await Post.create({
      title,
      content,
      author: session._id,
      status: finalStatus,
      aiFeedback,
    });

    return NextResponse.json({ 
      success: true, 
      post,
      message: finalStatus === 'REJECTED' ? `Content rejected by AI: ${aiFeedback}` : 'Post created successfully'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authorId = searchParams.get('authorId');
    const status = searchParams.get('status') || 'PUBLISHED';

    await connectToDatabase();
    
    const query: any = {};
    if (authorId) query.author = authorId;
    if (status !== 'ALL') query.status = status;

    const posts = await Post.find(query).populate('author', 'name image').sort({ createdAt: -1 });

    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
