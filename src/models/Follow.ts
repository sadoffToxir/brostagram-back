import mongoose, { Schema, Document } from 'mongoose'

export interface IFollow extends Document {
  followerId: mongoose.Types.ObjectId;
  followeeId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FollowSchema: Schema = new Schema({
  followerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  followeeId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IFollow>('Follow', FollowSchema)
