import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for Attachment
interface IAttachment {
    name: string;
    url: string;
    fileType?: string;
}

const attachmentSchema = new Schema<IAttachment>({
    name: { type: String, required: true },
    url: { type: String, required: true },
    fileType: String,
}, { _id: false });

// Interface for Awardee
interface IAwardee {
    name: string;
    program?: string;
    year: string;
    award: string;
}

const awardeeSchema = new Schema<IAwardee>({
    name: { type: String, required: true },
    program: String,
    year: { type: String, required: true },
    award: { type: String, required: true },
}, { _id: false });

// Interface for Announcement Document
export interface IAnnouncement extends Document {
    title: string;
    description: string;
    content: string;
    author: mongoose.Types.ObjectId;
    type: 'Event' | 'Award' | 'Workshop' | 'Meeting' | 'Seminar' | 'Achievement' | 'General';
    priority?: 'normal' | 'important' | 'urgent';
    targetAudience?: ('all' | 'members' | 'officers' | 'faculty')[];
    isPublished?: boolean;
    publishDate?: Date;
    expiryDate?: Date;
    // Event/Meeting specific fields
    time?: string;
    location?: string;
    organizer?: string;
    contact?: string;
    attendees?: string;
    agenda?: string[];
    // Award specific fields
    awardees?: IAwardee[];
    // Media
    imageUrl?: string | null;
    galleryImages?: string[];
    attachments?: IAttachment[];
    views?: number;
    // Virtuals
    isExpired: boolean;
    formattedDate: string;
    // Methods
    incrementViews(): Promise<this>;
}

const announcementSchema = new Schema<IAnnouncement>({
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
    type: {
        type: String,
        enum: ['Event', 'Award', 'Workshop', 'Meeting', 'Seminar', 'Achievement', 'General'],
        default: 'General',
        required: true,
    },
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
    // Event/Meeting specific fields
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
    attendees: {
        type: String,
        trim: true,
    },
    agenda: [String],
    // Award specific fields
    awardees: [awardeeSchema],
    // Media
    imageUrl: {
        type: String,
        default: null,
    },
    galleryImages: {
        type: [String],
        default: []
    },
    attachments: [attachmentSchema],
    views: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Indexes
announcementSchema.index({ publishDate: -1 });
announcementSchema.index({ isPublished: 1, publishDate: -1 });
announcementSchema.index({ type: 1 });
announcementSchema.index({ targetAudience: 1 });

// Virtual to check if announcement is expired
announcementSchema.virtual('isExpired').get(function (this: IAnnouncement) {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
});

// Virtual to format date
announcementSchema.virtual('formattedDate').get(function (this: IAnnouncement) {
    return this.publishDate?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }) || '';
});

// Method to increment views
announcementSchema.methods.incrementViews = function (this: IAnnouncement): Promise<IAnnouncement> {
    this.views = (this.views || 0) + 1;
    return this.save();
};

const Announcement: Model<IAnnouncement> = mongoose.model<IAnnouncement>('Announcement', announcementSchema);

export default Announcement;