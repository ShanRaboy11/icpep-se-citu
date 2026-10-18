import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvisor extends Document {
  faculty?: mongoose.Types.ObjectId | null;
  name: string;
  position: string; // e.g. "CPE Department Head", "ICPEP.SE Adviser"
  yearRange: string; // e.g. "2022 - Present", "2020 - 2022"
  isCurrent: boolean; // shown in the Home page's current Council Officers & Faculty roster
  image: string;
  gender?: 'male' | 'female' | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdvisorSchema: Schema = new Schema(
  {
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', default: null },
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    yearRange: { type: String, required: true, trim: true },
    isCurrent: { type: Boolean, default: false },
    image: { type: String, required: false },
    gender: { type: String, enum: ['male', 'female', null], default: null },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IAdvisor>('Advisor', AdvisorSchema);
