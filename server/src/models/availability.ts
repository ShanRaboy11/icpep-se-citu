import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAvailability extends Document {
  meeting: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  slots: string[]; // e.g. "YYYY-MM-DD|HH:MM"
  createdAt: Date;
  updatedAt: Date;
}

const availabilitySchema = new Schema<IAvailability>(
  {
    meeting: { type: Schema.Types.ObjectId, ref: "Meeting", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slots: { type: [String], default: [] },
  },
  { timestamps: true }
);

availabilitySchema.index({ meeting: 1, user: 1 }, { unique: true });

const Availability: Model<IAvailability> = mongoose.model<IAvailability>(
  "Availability",
  availabilitySchema
);

export default Availability;
