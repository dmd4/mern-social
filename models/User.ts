import { model, Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password?: string;
  email: string;
  createdAt: string;
  _doc?: any;
}

const userSchema = new Schema<IUser>({
  username: String,
  password: Schema.Types.String,
  email: String,
  createdAt: String
});

export default model<IUser>('User', userSchema);
