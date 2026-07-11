import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { getSession } from '@/lib/auth';
import { moderateContent } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const resolvedParams = await params;
    const post = await Post.findById(resolvedParams.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const moderation = await moderateContent(content, 'COMMENT');
    
    let status = 'PUBLISHED';
    let aiFeedback = '';
    
    if (!moderation.passed) {
      status = 'REJECTED';
      aiFeedback = moderation.feedback;
    }

    const comment = await Comment.create({
      content,
      author: session._id,
      post: post._id,
      status,
      aiFeedback,
    });

    if (status === 'PUBLISHED') {
      post.comments.push(comment._id);
      await post.save();
    }

    await comment.populate('author', 'name image');

    return NextResponse.json({ 
      success: true, 
      comment,
      message: status === 'REJECTED' ? `Comment rejected by AI: ${aiFeedback}` : 'Comment posted successfully'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const resolvedParams = await params;
    const comments = await Comment.find({ post: resolvedParams.id, status: 'PUBLISHED' })
      .populate('author', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json({ comments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
