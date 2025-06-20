import mongoose, { Document, Schema } from 'mongoose';

export interface ReceiptDocument extends Document {
  cashier: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
  }[];
  totalPrice: number;
  createdAt: Date;
}

const receiptSchema = new Schema<ReceiptDocument>(
  {
    cashier: { type: Schema.Types.ObjectId, ref: 'Cashier', required: true },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ReceiptModel = mongoose.model<ReceiptDocument>('Receipt', receiptSchema);