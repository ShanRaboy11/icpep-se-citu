import mongoose, { Document, Schema } from 'mongoose';

export interface IPartner extends Document {
  name: string;
  logo: string;
  type: 'sponsor' | 'partner';
  website?: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new Schema<IPartner>(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['sponsor', 'partner'],
      default: 'partner',
    },
    website: String,
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes
partnerSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.model<IPartner>('Partner', partnerSchema);