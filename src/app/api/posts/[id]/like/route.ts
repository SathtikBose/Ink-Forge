import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to like.' }, { status: 401 });
    }

    const resolvedParams = await params;
    await connectToDatabase();

    const post = await Post.findById(resolvedParams.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const userId = session._id;
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter((id: any) => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({ 
      success: true, 
      likesCount: post.likes.length,
      hasLiked: !hasLiked 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
