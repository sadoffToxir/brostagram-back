import mongoose, { Schema, Document } from 'mongoose'

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  postId: { type: mongoose.Types.ObjectId, required: true, ref: 'Post' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IComment>('Comment', CommentSchema)
