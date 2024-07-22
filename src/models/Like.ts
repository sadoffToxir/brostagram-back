import mongoose, { Schema, Document } from 'mongoose'

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<ILike>('Like', LikeSchema)
