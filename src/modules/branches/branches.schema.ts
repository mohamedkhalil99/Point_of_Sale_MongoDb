import mongoose, { Schema, Document } from 'mongoose';

export interface BranchDocument extends Document {
  name: string;
  address: string;
  phone: string;
}

const BranchSchema = new Schema<BranchDocument>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export const BranchModel = mongoose.model<BranchDocument>('Branch', BranchSchema);