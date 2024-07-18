import mongoose, { Schema, Document } from 'mongoose'

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  postId: { type: mongoose.Types.ObjectId, required: true, ref: 'Post' },
  createdAt: { type: Date, default: Date.now },
})

LikeSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v
    return ret
  }
})

export default mongoose.model<ILike>('Like', LikeSchema)
