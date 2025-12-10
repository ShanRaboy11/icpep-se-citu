import mongoose, { Schema, Document } from 'mongoose';

export interface ISponsor extends Document {
  name: string;
  type: string; // "Platinum Sponsor", "Gold Sponsor", "Silver Sponsor", "Bronze Sponsor"
  image: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const SponsorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['Platinum Sponsor', 'Gold Sponsor', 'Silver Sponsor', 'Bronze Sponsor']
    },
    image: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ISponsor>('Sponsor', SponsorSchema);
