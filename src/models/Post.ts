import mongoose, { Schema, Document } from 'mongoose'

interface Set {
  weight?: number;
  reps?: number;
  duration?: number;
  distance?: number;
  assistedWeight?: number;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  type: string;
  sets: Set[];
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  exercises: Exercise[];
  createdAt: Date;
}

const SetSchema: Schema = new Schema({
  weight: { type: Number },
  reps: { type: Number },
  duration: { type: Number },
  distance: { type: Number },
  assistedWeight: { type: Number },
})

const ExerciseSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  sets: [SetSchema],
})

const PostSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  exercises: [ExerciseSchema],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IPost>('Post', PostSchema)
