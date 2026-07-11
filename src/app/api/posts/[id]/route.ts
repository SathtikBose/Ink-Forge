import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import { getSession } from '@/lib/auth';
import { moderateContent } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    // Await params if Next.js version requires it (Next 15 params is often a promise)
    // Actually, in App router, params in API route can be sync or async. Let's just use it safely.
    const resolvedParams = await params; 
    const post = await Post.findById(resolvedParams.id).populate('author', 'name image');
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, status, coverImage } = await req.json();
    const resolvedParams = await params;

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
    
    const post = await Post.findById(resolvedParams.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    if (post.author.toString() !== session._id) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    post.status = finalStatus;
    post.aiFeedback = aiFeedback;
    
    await post.save();

    return NextResponse.json({ 
      success: true, 
      post,
      message: finalStatus === 'REJECTED' ? `Content rejected by AI: ${aiFeedback}` : 'Post updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    await connectToDatabase();

    const post = await Post.findById(resolvedParams.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    if (post.author.toString() !== session._id) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await post.deleteOne();
    
    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
