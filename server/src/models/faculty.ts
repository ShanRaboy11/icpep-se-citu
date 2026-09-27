import mongoose, { Schema, Document } from 'mongoose';

export interface IFaculty extends Document {
  name: string;
  position: string; // e.g. "Department Head", "Professor, Embedded Systems"
  image: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const FacultySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    image: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IFaculty>('Faculty', FacultySchema);
