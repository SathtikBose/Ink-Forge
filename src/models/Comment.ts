import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  status: 'PUBLISHED' | 'REJECTED';
  aiFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema<IComment> = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    status: { type: String, enum: ['PUBLISHED', 'REJECTED'], default: 'PUBLISHED' },
    aiFeedback: { type: String },
  },
  { timestamps: true }
);

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
