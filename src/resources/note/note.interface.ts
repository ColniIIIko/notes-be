import { Document, Schema } from 'mongoose';

export default interface Note extends Document {
  title: string;
  body: string;
  userId: Schema.Types.ObjectId;
}
