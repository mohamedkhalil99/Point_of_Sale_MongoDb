import mongoose, { Schema, Document, Types } from 'mongoose';

export interface CashierDocument extends Document {
  name: string;
  image?: string;
  email: string;
  password: string;
  branch: Types.ObjectId;
  role: 'cashier';
}

const CashierSchema = new Schema<CashierDocument>(
  {
    name: { type: String, required: true },
    image: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    role: { type: String, enum: ['cashier'], default: 'cashier' }
  },
  { timestamps: true }
);

export const CashierModel = mongoose.model<CashierDocument>('Cashier', CashierSchema);