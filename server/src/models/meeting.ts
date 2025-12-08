import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMeeting extends Document {
  title: string;
  agenda: string;
  departments: string[];
  selectedDates: string[]; // ISO date strings: YYYY-MM-DD
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "10:30 AM"
  timeLimit?: string; // e.g. "45 Minutes" | "No Limit"
  createdBy: mongoose.Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const meetingSchema = new Schema<IMeeting>(
  {
    title: { type: String, required: true, trim: true },
    agenda: { type: String, required: true, trim: true },
    departments: { type: [String], default: [] },
    selectedDates: { type: [String], default: [] },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timeLimit: { type: String, default: "No Limit" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

meetingSchema.index({ selectedDates: 1 });
meetingSchema.index({ createdAt: -1 });

const Meeting: Model<IMeeting> = mongoose.model<IMeeting>(
  "Meeting",
  meetingSchema
);

export default Meeting;
