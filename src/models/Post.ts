import mongoose, { Schema, Document } from 'mongoose'

interface Exercise {
  name: string;
  sets: number;
  repetitions: number;
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  exercises: Exercise[];
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number, required: true },
      repetitions: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IPost>('Post', PostSchema)
