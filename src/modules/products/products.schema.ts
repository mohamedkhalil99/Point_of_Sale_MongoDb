import { Schema, model, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  image?: string;
  price: number;
  category: string;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    image: { type: String, required: false },
    price: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const ProductModel = model<ProductDocument>('Product', productSchema);