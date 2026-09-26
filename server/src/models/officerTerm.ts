import mongoose, { Schema, Document } from 'mongoose';

// A historical record of one person's officer position for one academic
// year — independent of the live User-based "current officer" system, so
// past officers stay on record even after they're no longer students /
// no longer hold the position.
export interface IOfficerTerm extends Document {
  name: string;
  position: string; // e.g. "President", "Committee Head", "1st Year"
  role?: string; // optional sub-label, e.g. "Batch Representative", "Representative"
  departmentType: 'executive' | 'committee';
  committeeName?: string; // required when departmentType === 'committee'
  termYear: string; // e.g. "2024-2025"
  image?: string;
  isActive: boolean;
  displayOrder: number;
  // Set only when this entry was auto-generated from a live officer
  // assignment (Manage Officers), so re-saving that same assignment within
  // the same year updates this record instead of piling up duplicates.
  // Manually-entered archive records (for years predating this system)
  // leave this unset.
  sourceUserId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OfficerTermSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    role: { type: String, default: null, trim: true },
    departmentType: {
      type: String,
      enum: ['executive', 'committee'],
      required: true,
    },
    committeeName: { type: String, default: null, trim: true },
    termYear: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    sourceUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

OfficerTermSchema.index({ termYear: 1, departmentType: 1, committeeName: 1 });
OfficerTermSchema.index({ sourceUserId: 1, departmentType: 1, termYear: 1, committeeName: 1 });

export default mongoose.model<IOfficerTerm>('OfficerTerm', OfficerTermSchema);
