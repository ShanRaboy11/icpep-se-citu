import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  quote: string;
  image?: string;
  year?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    quote: {
      type: String,
      required: true,
    },
    image: String,
    year: String,
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
testimonialSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);