import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for Admission
interface IAdmission {
    category: string;
    price: string;
}

const admissionSchema = new Schema<IAdmission>({
    category: { type: String, required: true },
    price: { type: String, required: true },
}, { _id: false });

// Interface for Event Document
export interface IEvent extends Document {
    title: string;
    description: string;
    content: string;
    author: mongoose.Types.ObjectId;
    tags?: string[];
    priority?: 'normal' | 'important' | 'urgent';
    targetAudience?: ('all' | 'members' | 'officers' | 'faculty')[];
    isPublished?: boolean;
    publishDate?: Date;
    expiryDate?: Date;
    // Event specific fields
    eventDate: Date;
    time?: string;
    location?: string;
    organizer?: string;
    contact?: string;
    rsvpLink?: string;
    admissions?: IAdmission[];
    registrationRequired?: boolean;
    registrationStart?: Date;
    registrationEnd?: Date;
    // Media
    coverImage?: string | null;
    views?: number;
    // Virtuals
    isExpired: boolean;
    formattedDate: string;
    // Methods
    incrementViews(): Promise<this>;
}

const eventSchema = new Schema<IEvent>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: [String],
    priority: {
        type: String,
        enum: ['normal', 'important', 'urgent'],
        default: 'normal',
    },
    targetAudience: [
        {
            type: String,
            enum: ['all', 'members', 'officers', 'faculty'],
            default: 'all',
        },
    ],
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
    expiryDate: Date,
    // Event specific fields
    eventDate: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    time: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    organizer: {
        type: String,
        trim: true,
    },
    contact: {
        type: String,
        trim: true,
    },
    rsvpLink: {
        type: String,
        trim: true,
    },
    admissions: [admissionSchema],
    registrationRequired: {
        type: Boolean,
        default: false,
    },
    registrationStart: Date,
    registrationEnd: Date,
    // Media
    coverImage: {
        type: String,
        default: null,
    },
    views: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Indexes
eventSchema.index({ eventDate: -1 });
eventSchema.index({ publishDate: -1 });
eventSchema.index({ isPublished: 1, eventDate: -1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ targetAudience: 1 });

// Virtual to check if event is expired
eventSchema.virtual('isExpired').get(function (this: IEvent) {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
});

// Virtual to format date
eventSchema.virtual('formattedDate').get(function (this: IEvent) {
    return this.eventDate?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }) || '';
});

// Method to increment views
eventSchema.methods.incrementViews = function (this: IEvent): Promise<IEvent> {
    this.views = (this.views || 0) + 1;
    return this.save();
};

const Event: Model<IEvent> = mongoose.model<IEvent>('Event', eventSchema);

export default Event;