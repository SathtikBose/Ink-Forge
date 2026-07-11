import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'REJECTED';
  aiFeedback?: string;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverImage: { type: String },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'REJECTED'], default: 'DRAFT' },
    aiFeedback: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);
export default Post;
