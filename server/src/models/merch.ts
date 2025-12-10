import mongoose, { Schema, Document } from 'mongoose';

export interface IMerch extends Document {
  name: string;
  description: string;
  orderLink: string;
  image?: string;
  prices: { category: string; price: number }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MerchSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    orderLink: { type: String, required: true },
    image: { type: String },
    prices: [
      {
        category: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMerch>('Merch', MerchSchema);
