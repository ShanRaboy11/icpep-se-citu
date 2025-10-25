import mongoose, { Document, Schema } from 'mongoose';

interface IParticipant {
  user: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'attended';
  rsvpDate: Date;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  eventType: 'workshop' | 'seminar' | 'competition' | 'social' | 'meeting' | 'other';
  dateTime: {
    start: Date;
    end?: Date;
  };
  location?: string;
  venue?: string;
  capacity?: number;
  rsvpDeadline?: Date;
  participants: IParticipant[];
  organizers: mongoose.Types.ObjectId[];
  images: string[];
  coverImage?: string;
  isPublished: boolean;
  requiresApproval: boolean;
  approvedCount: number; // Virtual field
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<IParticipant>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'attended'],
      default: 'pending',
    },
    rsvpDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    eventType: {
      type: String,
      enum: ['workshop', 'seminar', 'competition', 'social', 'meeting', 'other'],
      default: 'other',
    },
    dateTime: {
      start: {
        type: Date,
        required: [true, 'Start date is required'],
      },
      end: Date,
    },
    location: String,
    venue: String,
    capacity: {
      type: Number,
      min: 0,
    },
    rsvpDeadline: Date,
    participants: [participantSchema],
    organizers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    images: [String],
    coverImage: String,
    isPublished: {
      type: Boolean,
      default: false,
    },
    requiresApproval: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual for approved participants count
eventSchema.virtual('approvedCount').get(function (this: IEvent) {
  return this.participants.filter((p) => p.status === 'approved').length;
});

// Indexes
eventSchema.index({ 'dateTime.start': 1 });
eventSchema.index({ isPublished: 1, 'dateTime.start': 1 });

export default mongoose.model<IEvent>('Event', eventSchema);