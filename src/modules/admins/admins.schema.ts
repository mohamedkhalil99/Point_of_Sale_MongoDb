import mongoose, { Schema, Document } from 'mongoose';

export interface AdminDocument extends Document {
  name: string;
  email: string;
  password: string;
  role:'admin';
}

const AdminSchema = new Schema<AdminDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:{ type:String, enum:['admin'], default:'admin' }
}, 
{timestamps: true}
);

export const AdminModel = mongoose.model<AdminDocument>('Admin', AdminSchema);