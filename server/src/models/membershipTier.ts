import mongoose, { Schema, Document } from 'mongoose';

// One pricing tier shown on the public /membership page — e.g. "Student
// Chapter", "All-Access Pass", "National Membership".
export interface IMembershipTier extends Document {
  planLabel: string; // small badge above the price, e.g. "Student"
  title: string;
  price: string; // e.g. "₱160" — kept as a string so admins can write "Free" etc.
  description: string;
  benefits: string[];
  accentColor: 'primary' | 'steel' | 'sky';
  isHighlighted: boolean; // shown center/larger as the "best value" tier
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipTierSchema: Schema = new Schema(
  {
    planLabel: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    benefits: { type: [String], default: [] },
    accentColor: {
      type: String,
      enum: ['primary', 'steel', 'sky'],
      default: 'steel',
    },
    isHighlighted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IMembershipTier>(
  'MembershipTier',
  MembershipTierSchema
);
