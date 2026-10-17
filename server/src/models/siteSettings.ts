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
  facebookUrl: string;
  tiktokUrl: string;
  instagramUrl: string;
  xUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
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
    facebookUrl: { type: String, trim: true, default: '' },
    tiktokUrl: { type: String, trim: true, default: '' },
    instagramUrl: { type: String, trim: true, default: '' },
    xUrl: { type: String, trim: true, default: '' },
    youtubeUrl: { type: String, trim: true, default: '' },
    linkedinUrl: { type: String, trim: true, default: '' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
