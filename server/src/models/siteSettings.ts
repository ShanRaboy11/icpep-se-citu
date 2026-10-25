import mongoose, { Schema, Document } from 'mongoose';

// Sitewide settings — a singleton (exactly one document ever exists; the
// controller upserts it rather than letting duplicates form). Starts as
// just maintenance mode; a natural place for other sitewide toggles later.
export interface ISiteSettings extends Document {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  primerUrl: string;
  contactEmail: string;
  secondaryEmail: string;
  socialLinks?: { platform: string; url: string }[];
  joinPhotos?: string[];
  aboutPhotos?: string[];
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: {
      type: String,
      trim: true,
      default: "We're making some improvements. Please check back soon.",
    },
    primerUrl: { type: String, trim: true, default: '' },
    contactEmail: { type: String, trim: true, default: '' },
    secondaryEmail: { type: String, trim: true, default: '' },
    socialLinks: {
      type: [new Schema({ platform: String, url: String }, { _id: false })],
      default: undefined,
    },
    joinPhotos: { type: [String], default: [] },
    aboutPhotos: { type: [String], default: [] },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
