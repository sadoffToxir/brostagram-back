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

interface Like {
  userId: mongoose.Types.ObjectId;
}

interface Comment {
  userId: mongoose.Types.ObjectId;
  comment: string;
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  exercises: Exercise[];
  likes: Like[];
  comments: Comment[];
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

const LikeSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

const CommentSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
})

const PostSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  exercises: [ExerciseSchema],
  likes: [LikeSchema],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IPost>('Post', PostSchema)
