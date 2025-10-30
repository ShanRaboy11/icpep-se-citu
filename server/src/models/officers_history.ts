import mongoose, { Document, Schema, Model } from 'mongoose';

interface IOfficer {
  user: mongoose.Types.ObjectId;
  position: string;
  department: 'executive' | 'communications' | 'technical' | 'finance' | 'logistics' | 'creatives';
  bio?: string;
  achievements?: string[];
}

export interface IOfficersHistory extends Document {
  academicYear: string;
  term: '1st Semester' | '2nd Semester' | 'Summer' | 'Full Year';
  officers: IOfficer[];
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const officerSchema = new Schema<IOfficer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      enum: ['executive', 'communications', 'technical', 'finance', 'logistics', 'creatives'],
      required: true,
    },
    bio: String,
    achievements: [String],
  },
  { _id: false }
);

const officersHistorySchema = new Schema<IOfficersHistory>(
  {
    academicYear: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      enum: ['1st Semester', '2nd Semester', 'Summer', 'Full Year'],
      default: 'Full Year',
    },
    officers: [officerSchema],
    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure only one current term
officersHistorySchema.pre('save', async function (next) {
  if (this.isCurrent) {
    // Type assertion to tell TypeScript this is a Mongoose model
    await (this.constructor as Model<IOfficersHistory>).updateMany(
      { _id: { $ne: this._id } },
      { isCurrent: false }
    );
  }
  next();
});

// Indexes
officersHistorySchema.index({ academicYear: 1, term: 1 });
officersHistorySchema.index({ isCurrent: 1 });

export default mongoose.model<IOfficersHistory>('OfficersHistory', officersHistorySchema);