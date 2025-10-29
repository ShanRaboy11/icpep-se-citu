import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for User reference (assuming a User model exists)
interface IUserRef {
    _id: mongoose.Types.ObjectId;
    // Add other user properties you might populate here, e.g., name, email
}

// Interface for Participant subdocument
export interface IParticipant {
    user: mongoose.Types.ObjectId | IUserRef; // Can be ObjectId or populated User object
    status?: 'pending' | 'approved' | 'rejected' | 'attended';
    rsvpDate?: Date;
}

const participantSchema = new Schema<IParticipant>({
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
}, { _id: false });

// Interface for Organizer subdocument
export interface IOrganizer {
    name: string;
    role?: string;
    imageUrl?: string;
}

const organizerSchema = new Schema<IOrganizer>({
    name: {
        type: String,
        required: true,
    },
    role: String,
    imageUrl: String,
}, { _id: false });

// Interface for Detail section
interface IDetail {
    title?: string;
    content?: string;
}

// Main Event Document Interface
export interface IEvent extends Document {
    title: string;
    description: string;
    details?: IDetail[];
    tags?: string[];
    eventType?: 'workshop' | 'seminar' | 'competition' | 'social' | 'meeting' | 'other';
    date: Date;
    endDate?: Date;
    mode: 'Online' | 'In-person' | 'Hybrid';
    location: string;
    venue?: string;
    capacity?: number;
    rsvpDeadline?: Date;
    participants: IParticipant[];
    organizer?: IOrganizer;
    organizerUsers?: mongoose.Types.ObjectId[];
    bannerImageUrl: string;
    galleryImageUrls?: string[];
    images?: string[]; // Legacy field
    coverImage?: string; // Legacy field
    isPublished?: boolean;
    requiresApproval?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    // Virtuals
    approvedCount: number;
    status: 'Upcoming' | 'Ongoing' | 'Ended';
}

const eventSchema = new Schema<IEvent>({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
    },
    details: [{
        title: String,
        content: String,
    }],
    tags: [String],
    eventType: {
        type: String,
        enum: ['workshop', 'seminar', 'competition', 'social', 'meeting', 'other'],
        default: 'other',
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    endDate: Date,
    mode: {
        type: String,
        enum: ['Online', 'In-person', 'Hybrid'],
        required: [true, 'Event mode is required'],
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
    },
    venue: String,
    capacity: {
        type: Number,
        min: 0,
    },
    rsvpDeadline: Date,
    participants: [participantSchema],
    organizer: organizerSchema,
    organizerUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    bannerImageUrl: {
        type: String,
        required: [true, 'Banner image is required'],
    },
    galleryImageUrls: [String],
    images: [String], // Legacy field
    coverImage: String, // Legacy field
    isPublished: {
        type: Boolean,
        default: false,
    },
    requiresApproval: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Virtual for approved participants count
eventSchema.virtual('approvedCount').get(function (this: IEvent) {
    return this.participants.filter((p) => p.status === 'approved').length;
});

// Virtual for dynamic status calculation (Upcoming | Ongoing | Ended)
eventSchema.virtual('status').get(function (this: IEvent) {
    const now = new Date();
    const startDate = new Date(this.date);
    // If endDate is not provided, assume event lasts until the end of the start date's day
    const endDate = this.endDate
        ? new Date(this.endDate)
        : new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59, 999); // End of the day

    if (now < startDate) {
        return 'Upcoming';
    } else if (now >= startDate && now <= endDate) {
        return 'Ongoing';
    } else {
        return 'Ended';
    }
});

// Ensure virtuals are included in JSON/Object output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Indexes
eventSchema.index({ date: 1 });
eventSchema.index({ isPublished: 1, date: 1 });
eventSchema.index({ tags: 1 });

const Event: Model<IEvent> = mongoose.model<IEvent>('Event', eventSchema);

export default Event;