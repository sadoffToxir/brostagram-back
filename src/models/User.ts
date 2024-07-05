import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileImage: string;
  bio: string;
  createdAt: Date;
  refreshToken: string;
  followersCount: number;
  followingCount: number;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  refreshToken: { type: String, default: '' },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
})

export default mongoose.model<IUser>('User', UserSchema)
