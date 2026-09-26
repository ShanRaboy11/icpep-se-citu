import mongoose, { Schema, Document } from 'mongoose';

// Page-level membership settings — a singleton (exactly one document ever
// exists; the controller upserts it rather than letting duplicates form).
export interface IMembershipSettings extends Document {
  isOpen: boolean; // whether registration is currently open sitewide
  registrationUrl: string; // e.g. a Google Form link
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSettingsSchema: Schema = new Schema(
  {
    isOpen: { type: Boolean, default: true },
    registrationUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMembershipSettings>(
  'MembershipSettings',
  MembershipSettingsSchema
);
