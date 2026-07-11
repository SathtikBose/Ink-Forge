import connectToDatabase from '@/lib/db';
import Comment from '@/models/Comment';
import { getSession } from '@/lib/auth';
import { moderateContent } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, content } = await req.json();

    if (!postId || !content) {
      return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 });
    }

    const moderation = await moderateContent(content, 'COMMENT');
    
    await connectToDatabase();

    const comment = await Comment.create({
      post: postId,
      author: session._id,
      content,
      status: moderation.passed ? 'PUBLISHED' : 'REJECTED',
      aiFeedback: moderation.passed ? '' : moderation.feedback,
    });

    if (!moderation.passed) {
      return NextResponse.json({ 
        error: `Comment rejected by AI: ${moderation.feedback}` 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const comments = await Comment.find({ post: postId, status: 'PUBLISHED' })
      .populate('author', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json({ comments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
