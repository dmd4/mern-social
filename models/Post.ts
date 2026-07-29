import { model, Schema, Document, Types } from 'mongoose';

export interface IComment {
  id?: string;
  _id?: Types.ObjectId;
  body: string;
  username: string;
  createdAt: string;
}

export interface ILike {
  id?: string;
  _id?: Types.ObjectId;
  username: string;
  createdAt: string;
}

export interface IPost extends Document {
  body: string;
  username: string;
  createdAt: string;
  comments: Types.DocumentArray<IComment & Document>;
  likes: Types.DocumentArray<ILike & Document>;
  user: Types.ObjectId;
}

const postSchema = new Schema<IPost>({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

export default model<IPost>('Post', postSchema);
